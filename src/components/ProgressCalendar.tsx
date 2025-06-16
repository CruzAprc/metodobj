
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { Dumbbell, Apple, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface ProgressCalendarProps {
  userData: any;
}

interface DailyProgress {
  id: string;
  date: string;
  treino_realizado: boolean;
  dieta_seguida: boolean;
}

const ProgressCalendar = ({ userData }: ProgressCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Carregar dados do progresso do usuário
  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user]);

  const loadProgressData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
        
      if (error) {
        console.error('Erro ao carregar progresso:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o progresso",
          variant: "destructive"
        });
      } else {
        setDailyProgress(data || []);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProgress = async (date: Date, type: 'treino' | 'dieta') => {
    if (!user) return;
    
    const dateString = date.toISOString().split('T')[0];
    const existingProgress = dailyProgress.find(p => p.date === dateString);
    
    try {
      if (existingProgress) {
        const updateData = {
          ...existingProgress,
          [type === 'treino' ? 'treino_realizado' : 'dieta_seguida']: 
            !existingProgress[type === 'treino' ? 'treino_realizado' : 'dieta_seguida']
        };
        
        const { error } = await supabase
          .from('user_daily_progress')
          .update(updateData)
          .eq('id', existingProgress.id);
          
        if (error) throw error;
        
        setDailyProgress(prev => 
          prev.map(p => p.id === existingProgress.id ? updateData : p)
        );
      } else {
        const newProgress = {
          user_id: user.id,
          date: dateString,
          treino_realizado: type === 'treino',
          dieta_seguida: type === 'dieta'
        };
        
        const { data, error } = await supabase
          .from('user_daily_progress')
          .insert(newProgress)
          .select()
          .single();
          
        if (error) throw error;
        
        setDailyProgress(prev => [...prev, data]);
      }
      
      toast({
        title: "Sucesso! 🎉",
        description: `${type === 'treino' ? 'Treino' : 'Dieta'} ${existingProgress && existingProgress[type === 'treino' ? 'treino_realizado' : 'dieta_seguida'] ? 'desmarcado' : 'marcado'} para ${date.toLocaleDateString('pt-BR')}`,
      });
      
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o progresso",
        variant: "destructive"
      });
    }
  };

  const getProgressForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return dailyProgress.find(p => p.date === dateString);
  };

  const isWorkoutDay = (date: Date) => {
    const progress = getProgressForDate(date);
    return progress?.treino_realizado || false;
  };

  const isDietDay = (date: Date) => {
    const progress = getProgressForDate(date);
    return progress?.dieta_seguida || false;
  };

  const getBothDay = (date: Date) => {
    return isWorkoutDay(date) && isDietDay(date);
  };

  const CustomDayContent = ({ date, displayMonth }: { date: Date, displayMonth: Date }) => {
    if (date.getMonth() !== displayMonth.getMonth()) return null;
    
    const isWorkout = isWorkoutDay(date);
    const isDiet = isDietDay(date);
    const isBoth = getBothDay(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
    const isFuture = date > new Date(new Date().setHours(23, 59, 59, 999));
    
    return (
      <div className="relative w-full h-full flex items-center justify-center group">
        <span className={`text-sm font-medium ${
          isBoth ? 'text-white font-bold' : 
          isWorkout ? 'text-pink-600 font-semibold' : 
          isDiet ? 'text-emerald-600 font-semibold' : 
          isToday ? 'text-pink-500 font-bold' :
          'text-gray-700'
        }`}>
          {date.getDate()}
        </span>
        
        {/* Background círculos com gradientes */}
        {isBoth && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 via-pink-500 to-emerald-400 shadow-lg -z-10" />
        )}
        {isWorkout && !isBoth && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-300 -z-10" />
        )}
        {isDiet && !isBoth && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 border-2 border-emerald-300 -z-10" />
        )}
        {isToday && !isWorkout && !isDiet && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-400 -z-10 animate-pulse" />
        )}
        
        {/* Indicadores visuais melhorados */}
        <div className="absolute -bottom-1 -right-1 flex gap-0.5">
          {isWorkout && (
            <div className="w-2 h-2 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full shadow-sm border border-white" />
          )}
          {isDiet && (
            <div className="w-2 h-2 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-sm border border-white" />
          )}
        </div>
        
        {/* Botões de ação com design melhorado */}
        {(isToday || isPast) && (
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleProgress(date, 'treino');
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg transition-all duration-200 transform hover:scale-110 ${
                isWorkout 
                  ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-pink-200' 
                  : 'bg-gradient-to-br from-pink-100 to-pink-200 text-pink-600 hover:from-pink-200 hover:to-pink-300 border-2 border-pink-300'
              }`}
              title="Marcar treino"
            >
              💪
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleProgress(date, 'dieta');
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg transition-all duration-200 transform hover:scale-110 ${
                isDiet 
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-200' 
                  : 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 hover:from-emerald-200 hover:to-emerald-300 border-2 border-emerald-300'
              }`}
              title="Marcar dieta"
            >
              🥗
            </button>
          </div>
        )}
      </div>
    );
  };

  const calculateStreak = (type: 'treino' | 'dieta') => {
    if (dailyProgress.length === 0) return 0;
    
    const sortedProgress = dailyProgress
      .filter(p => type === 'treino' ? p.treino_realizado : p.dieta_seguida)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (sortedProgress.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) { // Verificar últimos 30 dias
      const dateString = currentDate.toISOString().split('T')[0];
      const hasProgress = sortedProgress.some(p => p.date === dateString);
      
      if (hasProgress) {
        streak++;
      } else if (streak > 0) {
        break; // Quebrou a sequência
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  const getTotalProgress = () => {
    const workoutDays = dailyProgress.filter(p => p.treino_realizado).length;
    const dietDays = dailyProgress.filter(p => p.dieta_seguida).length;
    const totalDays = 30; // Meta de 30 dias
    return Math.round(((workoutDays + dietDays) / (totalDays * 2)) * 100);
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-br from-pink-50 to-white rounded-3xl p-8 shadow-xl border border-pink-100">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Carregando seu progresso...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-pink-100 to-emerald-100 rounded-2xl p-1 shadow-lg border border-pink-200">
          <TabsTrigger 
            value="calendar" 
            className="flex items-center gap-2 rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            <CalendarIcon size={16} />
            Calendário
          </TabsTrigger>
          <TabsTrigger 
            value="stats" 
            className="flex items-center gap-2 rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            <span>📊</span>
            Estatísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-6 bg-gradient-to-r from-pink-500 to-emerald-500 text-white">
              <CardTitle className="text-2xl font-bold mb-4">Seu Progresso Diário ✨</CardTitle>
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                  <div className="w-3 h-3 bg-pink-300 rounded-full border border-white" />
                  <span className="font-medium">Treino</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                  <div className="w-3 h-3 bg-emerald-300 rounded-full border border-white" />
                  <span className="font-medium">Dieta</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                  <div className="w-3 h-3 bg-gradient-to-br from-pink-300 to-emerald-300 rounded-full border border-white" />
                  <span className="font-medium">Ambos</span>
                </div>
              </div>
              <p className="text-xs text-pink-100 mt-3 font-medium">
                Passe o mouse sobre os dias para marcar treino 💪 e dieta 🥗
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full flex justify-center [&_.rdp-day]:h-12 [&_.rdp-day]:w-12 [&_.rdp-cell]:p-1"
                components={{
                  DayContent: CustomDayContent as any,
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-6 rounded-3xl border-2 border-pink-300 shadow-xl"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <Dumbbell className="text-white" size={20} />
                </div>
                <p className="text-sm text-gray-700 text-center font-medium">Sequência Treino</p>
                <p className="font-bold text-gray-800 text-center text-2xl mb-1">
                  {calculateStreak('treino')} dias
                </p>
                <p className="text-xs text-pink-600 text-center font-semibold">
                  🔥 Em chamas!
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300 p-6 rounded-3xl border-2 border-emerald-300 shadow-xl"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <Apple className="text-white" size={20} />
                </div>
                <p className="text-sm text-gray-700 text-center font-medium">Sequência Dieta</p>
                <p className="font-bold text-gray-800 text-center text-2xl mb-1">
                  {calculateStreak('dieta')} dias
                </p>
                <p className="text-xs text-emerald-600 text-center font-semibold">
                  🌱 Disciplinada!
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-100 via-purple-200 to-pink-200 p-6 rounded-3xl border-2 border-purple-300 shadow-xl col-span-2"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">🏆</span>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-2">Progresso Total</p>
                <p className="font-bold text-gray-800 text-3xl mb-3">
                  {getTotalProgress()}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-3 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-pink-500 via-purple-500 to-emerald-500 h-4 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.min(getTotalProgress(), 100)}%` }}
                  />
                </div>
                <p className="text-sm text-purple-600 font-semibold">
                  Continue assim, você está arrasando! 💪✨
                </p>
              </div>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProgressCalendar;
