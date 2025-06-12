import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Coffee, 
  Utensils, 
  Sandwich, 
  Moon, 
  Dumbbell, 
  Camera, 
  User, 
  Settings,
  Calendar,
  TrendingUp,
  Clock,
  ChefHat,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Target,
  Activity,
  Timer,
  Flame,
  Check,
  Plus
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import EditProfileModal from '@/components/EditProfileModal';
import ProgressCalendar from '@/components/ProgressCalendar';
import { toast } from "@/hooks/use-toast";

// Componente Dock Item
const DockItem = ({ children, onClick, mouseX, spring, distance, magnification, baseItemSize, className = "" }: any) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
    return val - rect.x - rect.width / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
    { clamp: true }
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full 
                  bg-gradient-to-br from-pink-100 to-pink-200 
                  border-2 border-pink-300/50 shadow-lg 
                  hover:from-pink-200 hover:to-pink-300
                  transition-all duration-300 cursor-pointer
                  ${className}`}
      tabIndex={0}
      role="button"
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<any>, { isHovered }) : child
      )}
    </motion.div>
  );
};

// Componente Dock Label
const DockLabel = ({ children, isHovered }: any) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest: number) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute -top-10 left-1/2 w-fit whitespace-nowrap 
                     rounded-lg border border-pink-200 
                     bg-white/90 backdrop-blur-sm
                     px-3 py-1.5 text-xs text-gray-700 shadow-xl"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Componente Dock Icon
const DockIcon = ({ children }: any) => {
  return (
    <div className="flex items-center justify-center w-full h-full text-pink-600">
      {children}
    </div>
  );
};

// Componente Dock Principal
const Dock = ({ items, className = "", spring = { mass: 0.1, stiffness: 150, damping: 12 }, magnification = 70, distance = 200, panelHeight = 64, baseItemSize = 50 }: any) => {
  const mouseX = useMotionValue(Infinity);
  const isPanelHovered = useMotionValue(0);

  const calculatedMaxHeight = Math.max(panelHeight, magnification + baseItemSize / 4 + 4);
  const heightRow = useTransform(isPanelHovered, [0, 1], [panelHeight, calculatedMaxHeight]);
  const animatedHeight = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{ height: animatedHeight }}
      className="flex justify-center items-end w-full"
      onHoverStart={() => isPanelHovered.set(1)}
      onHoverEnd={() => isPanelHovered.set(0)}
    >
      <motion.div
        onMouseMove={({ pageX }) => mouseX.set(pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`${className} 
                    flex items-end w-fit gap-4 
                    rounded-2xl 
                    border-2 border-pink-200/50
                    pb-3 px-4
                    bg-white/80 backdrop-blur-md 
                    shadow-2xl`}
        style={{ height: panelHeight }}
      >
        {items.map((item: any, index: number) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
};

// Dashboard Principal
const AppJujuDashboard = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [dietData, setDietData] = useState<any>(null);
  const [workoutData, setWorkoutData] = useState<any>(null);
  const [userPhotos, setUserPhotos] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dailyTasks, setDailyTasks] = useState({
    workout: false,
    diet: false,
    motivation: false
  });
  const [todayProgress, setTodayProgress] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const iconSize = 22;

  // Function to calculate user progress
  const calculateProgress = () => {
    if (!userData) return 0;
    
    let progress = 0;
    
    // Quiz alimentar (20%)
    if (userData.quiz_alimentar_concluido) {
      progress += 20;
    }
    
    // Quiz treino (20%)
    if (userData.quiz_treino_concluido) {
      progress += 20;
    }
    
    // Fotos de avaliação (25%)
    if (userPhotos.length > 0) {
      const uniquePhotoTypes = [...new Set(userPhotos.map(photo => photo.photo_type))];
      progress += Math.round(Math.min(uniquePhotoTypes.length / 3, 1) * 25);
    }
    
    // Dias de uso (15%)
    if (userData.dias_no_app) {
      progress += Math.round(Math.min(userData.dias_no_app / 30, 1) * 15);
    }

    // Tarefas diárias (20%)
    const completedTasks = Object.values(dailyTasks).filter(Boolean).length;
    progress += Math.round((completedTasks / 3) * 20);
    
    return Math.min(progress, 100);
  };

  // Load today's progress
  const loadTodayProgress = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('user_daily_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();
      
    if (data) {
      setTodayProgress(data);
      setDailyTasks({
        workout: data.treino_realizado,
        diet: data.dieta_seguida,
        motivation: data.motivacao_lida || false
      });
    }
  };

  // Toggle daily task
  const toggleDailyTask = async (taskType: 'workout' | 'diet' | 'motivation') => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const newTaskState = !dailyTasks[taskType];
    
    try {
      const updateData = {
        user_id: user.id,
        date: today,
        treino_realizado: taskType === 'workout' ? newTaskState : dailyTasks.workout,
        dieta_seguida: taskType === 'diet' ? newTaskState : dailyTasks.diet,
        motivacao_lida: taskType === 'motivation' ? newTaskState : dailyTasks.motivation
      };

      if (todayProgress) {
        // Update existing record
        const { error } = await supabase
          .from('user_daily_progress')
          .update(updateData)
          .eq('id', todayProgress.id);
          
        if (error) throw error;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('user_daily_progress')
          .insert(updateData)
          .select()
          .single();
          
        if (error) throw error;
        setTodayProgress(data);
      }

      setDailyTasks(prev => ({
        ...prev,
        [taskType]: newTaskState
      }));

      const taskNames = {
        workout: 'Treino',
        diet: 'Dieta',
        motivation: 'Motivação'
      };

      toast({
        title: newTaskState ? "Parabéns! 🎉" : "Desmarcado",
        description: `${taskNames[taskType]} ${newTaskState ? 'concluído' : 'desmarcado'} para hoje!`,
      });

    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa",
        variant: "destructive"
      });
    }
  };

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      loadUserData();
      loadDietData();
      loadWorkoutData();
      loadUserPhotos();
      loadTodayProgress();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('teste_app')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (data && !error) {
      setUserData(data);
      setUserName(data.nome || 'Usuário');
    } else {
      console.log('Erro ao carregar dados do usuário:', error);
      setUserName('Usuário');
    }
  };

  const loadDietData = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('teste_dieta')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (data) {
      setDietData(data);
    }
  };

  const loadWorkoutData = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('teste_treino')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (data) {
      setWorkoutData(data);
    }
  };

  const loadUserPhotos = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_photos')
      .select('*')
      .eq('user_id', user.id);
      
    if (data) {
      setUserPhotos(data);
    }
  };

  // Handler for when profile is updated
  const handleProfileUpdate = () => {
    loadUserData();
  };

  const dockItems = [
    {
      icon: <TrendingUp size={iconSize} />,
      label: 'Dashboard',
      onClick: () => setCurrentTab('dashboard')
    },
    {
      icon: <Coffee size={iconSize} />,
      label: 'Dieta',
      onClick: () => navigate('/dashboard/dieta')
    },
    {
      icon: <Dumbbell size={iconSize} />,
      label: 'Treinos',
      onClick: () => navigate('/dashboard/treino')
    },
    {
      icon: <Camera size={iconSize} />,
      label: 'Avaliação',
      onClick: () => setCurrentTab('avaliacao')
    },
    {
      icon: <User size={iconSize} />,
      label: 'Perfil',
      onClick: () => setCurrentTab('perfil')
    }
  ];

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center relative bg-gradient-to-br from-pink-50 via-white to-pink-100 transition-colors duration-300">
      
      {/* Ilustrações de fundo */}
      <div className="absolute top-10 right-10 opacity-5 hidden md:block">
        <div className="w-32 h-32 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full flex items-center justify-center">
          <span className="text-4xl">🏃‍♀️</span>
        </div>
      </div>
      
      <div className="absolute bottom-32 left-10 opacity-5 hidden md:block">
        <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center">
          <span className="text-3xl">💪</span>
        </div>
      </div>

      {/* Conteúdo principal com abas */}
      <div className="flex-1 flex items-center justify-center w-full px-4">
        <motion.div 
          key={currentTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl"
        >
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">

            <TabsContent value="dashboard" className="mt-0">
              <div className="text-center space-y-8">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                    Olá, {userName}! 👋
                  </h1>
                  <p className="text-gray-600 text-lg">Pronta para mais um dia incrível?</p>
                </div>
                
                {/* Cards de resumo melhorados */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-3xl border border-pink-200 shadow-lg"
                  >
                    <Calendar className="text-pink-500 mx-auto mb-3" size={28} />
                    <p className="text-sm text-gray-600 mb-1">Dias no App</p>
                    <p className="font-bold text-gray-800 text-2xl">
                      {userData?.dias_no_app || 0}
                    </p>
                    <p className="text-xs text-pink-500 mt-1">dias consecutivos</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-3xl border border-purple-200 shadow-lg"
                  >
                    <TrendingUp className="text-purple-500 mx-auto mb-3" size={28} />
                    <p className="text-sm text-gray-600 mb-1">Progresso</p>
                    <p className="font-bold text-gray-800 text-2xl">
                      {calculateProgress()}%
                    </p>
                    <p className="text-xs text-purple-500 mt-1">da jornada</p>
                  </motion.div>
                </div>

                {/* Seção de Séries/Atividades - Nova estrutura inspirada na imagem */}
                <div className="w-full max-w-6xl mx-auto space-y-4 px-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-center">Suas Atividades Hoje</h2>
                  
                  {/* Grid responsivo para cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    
                    {/* Card de Série - Dieta da Juju */}
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-white rounded-2xl border-l-4 border-pink-400 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer col-span-1"
                      onClick={() => navigate('/dashboard/dieta')}
                    >
                      <div className="p-4 md:p-6">
                        <div className="flex items-start space-x-3 md:space-x-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Coffee className="text-white" size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 text-base md:text-lg leading-tight">PLANO ALIMENTAR</h3>
                            <p className="text-gray-600 text-xs md:text-sm mt-1 leading-relaxed">Cardápio personalizado da Juju para você se sentir incrível</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Flame size={12} className="text-pink-500 flex-shrink-0" />
                              <span className="text-xs text-pink-600 font-semibold">Nutrição Otimizada</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-3">
                          <ChevronRight className="text-gray-400" size={20} />
                        </div>
                      </div>
                    </motion.div>

                    {/* Card de Série - Treino do Basa */}
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-white rounded-2xl border-l-4 border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer col-span-1"
                      onClick={() => navigate('/dashboard/treino')}
                    >
                      <div className="p-4 md:p-6">
                        <div className="flex items-start space-x-3 md:space-x-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Dumbbell className="text-white" size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 text-base md:text-lg leading-tight">TREINO DO BASA</h3>
                            <p className="text-gray-600 text-xs md:text-sm mt-1 leading-relaxed">Exercícios desenvolvidos especialmente para seus objetivos</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Target size={12} className="text-blue-500 flex-shrink-0" />
                              <span className="text-xs text-blue-600 font-semibold">Foco & Resultado</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-3">
                          <ChevronRight className="text-gray-400" size={20} />
                        </div>
                      </div>
                    </motion.div>

                    {/* Card de Progresso */}
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-white rounded-2xl border-l-4 border-green-400 shadow-lg hover:shadow-xl transition-all duration-300 col-span-1 lg:col-span-2 xl:col-span-1"
                    >
                      <div className="p-4 md:p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Activity className="text-white" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-800 text-base md:text-lg leading-tight">ACOMPANHAMENTO</h3>
                              <p className="text-gray-600 text-xs md:text-sm mt-1 leading-relaxed">Monitore sua evolução diária e celebre suas conquistas</p>
                              <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-3">
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-pink-400 rounded-full flex-shrink-0"></div>
                                  <span className="text-xs text-gray-600">Dieta</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                                  <span className="text-xs text-gray-600">Treino</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                                  <span className="text-xs text-gray-600">Progresso</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <div className="text-xl md:text-2xl font-bold text-green-600">{calculateProgress()}%</div>
                            <div className="text-xs text-gray-500">completo</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Motivação interativa do dia */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-3xl border border-pink-200 max-w-lg mx-auto"
                >
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                      <Target size={20} className="text-pink-500" />
                      Metas do Dia
                    </h3>
                    <p className="text-gray-600 text-sm italic mb-4">
                      "Cada pequena ação te aproxima do seu objetivo!"
                    </p>
                  </div>

                  {/* Tarefas diárias interativas */}
                  <div className="space-y-3 mb-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleDailyTask('workout')}
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${
                        dailyTasks.workout 
                          ? 'bg-blue-100 border-blue-300 text-blue-700' 
                          : 'bg-white border-gray-200 hover:border-blue-200 text-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Dumbbell size={18} className={dailyTasks.workout ? 'text-blue-600' : 'text-gray-400'} />
                        <span className="text-sm font-medium">Completei meu treino</span>
                      </div>
                      {dailyTasks.workout ? (
                        <CheckCircle size={18} className="text-blue-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleDailyTask('diet')}
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${
                        dailyTasks.diet 
                          ? 'bg-green-100 border-green-300 text-green-700' 
                          : 'bg-white border-gray-200 hover:border-green-200 text-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Coffee size={18} className={dailyTasks.diet ? 'text-green-600' : 'text-gray-400'} />
                        <span className="text-sm font-medium">Segui minha dieta</span>
                      </div>
                      {dailyTasks.diet ? (
                        <CheckCircle size={18} className="text-green-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleDailyTask('motivation')}
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${
                        dailyTasks.motivation 
                          ? 'bg-pink-100 border-pink-300 text-pink-700' 
                          : 'bg-white border-gray-200 hover:border-pink-200 text-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Flame size={18} className={dailyTasks.motivation ? 'text-pink-600' : 'text-gray-400'} />
                        <span className="text-sm font-medium">Li minha motivação</span>
                      </div>
                      {dailyTasks.motivation ? (
                        <CheckCircle size={18} className="text-pink-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                    </motion.button>
                  </div>

                  {/* Progresso do dia */}
                  <div className="text-center">
                    <div className="flex justify-center gap-2 mb-2">
                      {Object.values(dailyTasks).map((completed, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            completed ? 'bg-gradient-to-r from-pink-400 to-purple-400' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-pink-600 text-xs font-semibold">
                      {Object.values(dailyTasks).filter(Boolean).length}/3 metas concluídas hoje
                    </p>
                  </div>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="avaliacao" className="mt-0">
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">Avaliação 📸</h2>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200 max-w-md mx-auto">
                  <Camera className="text-gray-400 mx-auto mb-4" size={48} />
                  <p className="text-gray-600 mb-2">Liberação em:</p>
                  <p className="text-2xl font-bold text-pink-600">7 dias</p>
                  <p className="text-sm text-gray-500 mt-2">Continue seguindo seu plano! 💪</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="perfil" className="mt-0">
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">Perfil 👤</h2>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl border border-pink-200 max-w-md mx-auto space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">👩‍💪</span>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-gray-800 text-lg">{userName}</p>
                    {userData ? (
                      <>
                        <p className="text-gray-600">{userData.email}</p>
                        <p className="text-gray-600">{userData.whatsapp}</p>
                        <div className="pt-2 space-y-1">
                          <p className="text-sm text-gray-500">
                            Membro desde: {new Date(userData.created_at).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-sm text-gray-500">
                            Dias no app: {userData.dias_no_app} dias
                          </p>
                          <div className="flex justify-center gap-4 pt-2">
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Quiz Alimentar</p>
                              <p className={`text-sm font-bold ${userData.quiz_alimentar_concluido ? 'text-green-600' : 'text-gray-400'}`}>
                                {userData.quiz_alimentar_concluido ? '✓ Concluído' : '○ Pendente'}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Quiz Treino</p>
                              <p className={`text-sm font-bold ${userData.quiz_treino_concluido ? 'text-green-600' : 'text-gray-400'}`}>
                                {userData.quiz_treino_concluido ? '✓ Concluído' : '○ Pendente'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500">Carregando dados...</p>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-2 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all"
                  >
                    Editar Perfil
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Dock na parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8">
        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>

      {/* Instrução */}
      <p className="fixed bottom-2 left-1/2 -translate-x-1/2 text-center text-xs text-gray-400">
        Navegue pelas opções no dock 💕
      </p>

      {/* Modal de Edição de Perfil */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default AppJujuDashboard;
