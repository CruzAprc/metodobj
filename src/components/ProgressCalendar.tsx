
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { Dumbbell, Apple, Calendar as CalendarIcon } from 'lucide-react';

interface ProgressCalendarProps {
  userData: any;
}

const ProgressCalendar = ({ userData }: ProgressCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Mock data - aqui você pode integrar com dados reais do Supabase
  const workoutDays = [
    new Date(2025, 5, 5), // Junho 5
    new Date(2025, 5, 7), // Junho 7
    new Date(2025, 5, 9), // Junho 9
    new Date(2025, 5, 12), // Junho 12
    new Date(2025, 5, 14), // Junho 14
  ];
  
  const dietDays = [
    new Date(2025, 5, 4), // Junho 4
    new Date(2025, 5, 5), // Junho 5
    new Date(2025, 5, 6), // Junho 6
    new Date(2025, 5, 7), // Junho 7
    new Date(2025, 5, 8), // Junho 8
    new Date(2025, 5, 9), // Junho 9
    new Date(2025, 5, 10), // Junho 10
    new Date(2025, 5, 12), // Junho 12
  ];

  const isWorkoutDay = (date: Date) => {
    return workoutDays.some(workoutDay => 
      workoutDay.toDateString() === date.toDateString()
    );
  };

  const isDietDay = (date: Date) => {
    return dietDays.some(dietDay => 
      dietDay.toDateString() === date.toDateString()
    );
  };

  const getBothDay = (date: Date) => {
    return isWorkoutDay(date) && isDietDay(date);
  };

  const CustomDayContent = ({ date, displayMonth }: { date: Date, displayMonth: Date }) => {
    if (date.getMonth() !== displayMonth.getMonth()) return null;
    
    const isWorkout = isWorkoutDay(date);
    const isDiet = isDietDay(date);
    const isBoth = getBothDay(date);
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className={`text-sm ${
          isBoth ? 'text-white font-bold' : 
          isWorkout ? 'text-blue-600 font-semibold' : 
          isDiet ? 'text-green-600 font-semibold' : 
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
        
        {/* Pequenos ícones indicadores */}
        <div className="absolute -bottom-1 -right-1 flex gap-0.5">
          {isWorkout && (
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          )}
          {isDiet && (
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          )}
        </div>
      </div>
    );
  };

  const calculateStreak = (days: Date[]) => {
    // Simular uma sequência de dias
    return days.length > 0 ? Math.min(days.length, 7) : 0;
  };

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
                {calculateStreak(workoutDays)} dias
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
                {calculateStreak(dietDays)} dias
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
                  {Math.round(((workoutDays.length + dietDays.length) / 30) * 100)}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(((workoutDays.length + dietDays.length) / 30) * 100, 100)}%` }}
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

