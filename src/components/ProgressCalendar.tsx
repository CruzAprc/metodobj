
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
        // Atualizar registro existente
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
        
        // Atualizar estado local
        setDailyProgress(prev => 
          prev.map(p => p.id === existingProgress.id ? updateData : p)
        );
      } else {
        // Criar novo registro
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
        
        // Adicionar ao estado local
        setDailyProgress(prev => [...prev, data]);
      }
      
      toast({
        title: "Sucesso!",
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
        <span className={`text-sm ${
          isBoth ? 'text-white font-bold' : 
          isWorkout ? 'text-blue-600 font-semibold' : 
          isDiet ? 'text-green-600 font-semibold' : 
          isToday ? 'text-pink-600 font-bold' :
          'text-gray-600'
        }`}>
          {date.getDate()}
        </span>
        
        {isBoth && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-green-500 -z-10" />
        )}
        {isWorkout && !isBoth && (
          <div className="absolute inset-0 rounded-full bg-blue-100 -z-10" />
        )}
        {isDiet && !isBoth && (
          <div className="absolute inset-0 rounded-full bg-green-100 -z-10" />
        )}
        {isToday && !isWorkout && !isDiet && (
          <div className="absolute inset-0 rounded-full bg-pink-100 -z-10" />
        )}
        
        {/* Pequenos ícones indicadores */}
        <div className="absolute -bottom-1 -right-1 flex gap-0.5">
          {isWorkout && (
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          )}
          {isDiet && (
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          )}
        </div>
        
        {/* Botões para marcar treino/dieta - aparecem apenas para hoje e dias passados */}
        {(isToday || isPast) && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleProgress(date, 'treino');
              }}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isWorkout 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
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
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isDiet 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
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
        <p className="text-gray-600">Carregando progresso...</p>
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
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon size={16} />
            Calendário
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <span>📊</span>
            Estatísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-gray-800">Seu Progresso Diário</CardTitle>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 rounded-full border-2 border-blue-500" />
                  <span className="text-blue-600">Treino</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded-full border-2 border-green-500" />
                  <span className="text-green-600">Dieta</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-full" />
                  <span className="text-purple-600">Ambos</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Passe o mouse sobre os dias para marcar treino 💪 e dieta 🥗
              </p>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full flex justify-center"
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
              className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl border border-blue-200"
            >
              <Dumbbell className="text-blue-500 mx-auto mb-2" size={24} />
              <p className="text-sm text-gray-600 text-center">Sequência Treino</p>
              <p className="font-bold text-gray-800 text-center text-2xl">
                {calculateStreak('treino')} dias
              </p>
              <p className="text-xs text-blue-600 text-center mt-1">
                🔥 Em chamas!
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl border border-green-200"
            >
              <Apple className="text-green-500 mx-auto mb-2" size={24} />
              <p className="text-sm text-gray-600 text-center">Sequência Dieta</p>
              <p className="font-bold text-gray-800 text-center text-2xl">
                {calculateStreak('dieta')} dias
              </p>
              <p className="text-xs text-green-600 text-center mt-1">
                🌱 Disciplinada!
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl border border-purple-200 col-span-2"
            >
              <div className="text-center">
                <p className="text-sm text-gray-600">Progresso Total</p>
                <p className="font-bold text-gray-800 text-3xl mb-2">
                  {getTotalProgress()}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(getTotalProgress(), 100)}%` }}
                  />
                </div>
                <p className="text-xs text-purple-600">
                  Continue assim, você está arrasando! 💪
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
