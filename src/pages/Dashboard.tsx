import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Coffee, Utensils, Sandwich, Moon, Dumbbell, Camera, User, Settings, Calendar, TrendingUp, Clock, ChefHat, RefreshCw, CheckCircle, AlertCircle, ChevronRight, Target, Activity, Timer, Flame, Check, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import EditProfileModal from '@/components/EditProfileModal';
import ProgressCalendar from '@/components/ProgressCalendar';
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Componente Dock Item
const DockItem = ({
  children,
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  className = ""
}: any) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);
  const mouseDistance = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    };
    return val - rect.x - rect.width / 2;
  });
  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize], {
    clamp: true
  });
  const size = useSpring(targetSize, spring);
  return <motion.div ref={ref} style={{
    width: size,
    height: size
  }} onHoverStart={() => isHovered.set(1)} onHoverEnd={() => isHovered.set(0)} onClick={onClick} className={`relative inline-flex items-center justify-center rounded-full 
                  bg-gradient-to-br from-sky-100 to-sky-200 
                  border-2 border-sky-300/50 shadow-lg 
                  hover:from-sky-200 hover:to-sky-300
                  transition-all duration-300 cursor-pointer
                  ${className}`} tabIndex={0} role="button">
      {React.Children.map(children, child => React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<any>, {
      isHovered
    }) : child)}
    </motion.div>;
};

// Componente Dock Label
const DockLabel = ({
  children,
  isHovered
}: any) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest: number) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);
  return <AnimatePresence>
      {isVisible && <motion.div initial={{
      opacity: 0,
      y: 5
    }} animate={{
      opacity: 1,
      y: -10
    }} exit={{
      opacity: 0,
      y: 5
    }} transition={{
      duration: 0.2,
      ease: "easeOut"
    }} className="absolute -top-10 left-1/2 w-fit whitespace-nowrap 
                     rounded-lg border border-sky-200 
                     bg-white/90 backdrop-blur-sm
                     px-3 py-1.5 text-xs text-gray-700 shadow-xl" style={{
      x: "-50%"
    }}>
          {children}
        </motion.div>}
    </AnimatePresence>;
};

// Componente Dock Icon
const DockIcon = ({
  children
}: any) => {
  return <div className="flex items-center justify-center w-full h-full text-sky-600">
      {children}
    </div>;
};

// Componente Dock Principal
const Dock = ({
  items,
  className = "",
  spring = {
    mass: 0.1,
    stiffness: 150,
    damping: 12
  },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  baseItemSize = 50
}: any) => {
  const mouseX = useMotionValue(Infinity);
  const isPanelHovered = useMotionValue(0);
  const calculatedMaxHeight = Math.max(panelHeight, magnification + baseItemSize / 4 + 4);
  const heightRow = useTransform(isPanelHovered, [0, 1], [panelHeight, calculatedMaxHeight]);
  const animatedHeight = useSpring(heightRow, spring);
  return <motion.div style={{
    height: animatedHeight
  }} className="flex justify-center items-end w-full" onHoverStart={() => isPanelHovered.set(1)} onHoverEnd={() => isPanelHovered.set(0)}>
      <motion.div onMouseMove={({
      pageX
    }) => mouseX.set(pageX)} onMouseLeave={() => mouseX.set(Infinity)} className={`${className} 
                    flex items-end w-fit gap-4 
                    rounded-2xl 
                    border-2 border-sky-200/50
                    pb-3 px-4
                    bg-white/80 backdrop-blur-md 
                    shadow-2xl`} style={{
      height: panelHeight
    }}>
        {items.map((item: any, index: number) => <DockItem key={index} onClick={item.onClick} mouseX={mouseX} spring={spring} distance={distance} magnification={magnification} baseItemSize={baseItemSize}>
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>)}
      </motion.div>
    </motion.div>;
};

// Dashboard Principal
const AppJujuDashboard = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [personalData, setPersonalData] = useState<any>(null);
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
  const [diasNoApp, setDiasNoApp] = useState(0);
  const [evaluationUnlocked, setEvaluationUnlocked] = useState(false);
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const iconSize = isMobile ? 18 : 22;

  // Function to calculate days in app
  const calculateDaysInApp = (dataRegistro: string) => {
    const registroDate = new Date(dataRegistro);
    const hoje = new Date();
    const diffTime = hoje.getTime() - registroDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    console.log('Calculando dias no app:', {
      dataRegistro,
      registroDate,
      hoje,
      diffTime,
      diffDays
    });
    return Math.max(0, diffDays);
  };

  // Function to calculate user progress
  const calculateProgress = () => {
    if (!userData) return 0;
    let progress = 0;

    // Quiz alimentar (20%)
    if (userData.quiz_alimentar_concluido) {
      progress += 20;
    }

    // Quiz treino (20%) - using the new approach to check for workout quiz data
    if (workoutData) {
      progress += 20;
    }

    // Fotos de avaliação (25%)
    if (userPhotos.length > 0) {
      const uniquePhotoTypes = [...new Set(userPhotos.map(photo => photo.photo_type))];
      progress += Math.round(Math.min(uniquePhotoTypes.length / 3, 1) * 25);
    }

    // Dias de uso (15%)
    if (diasNoApp) {
      progress += Math.round(Math.min(diasNoApp / 30, 1) * 15);
    }

    // Tarefas diárias (20%)
    const completedTasks = Object.values(dailyTasks).filter(Boolean).length;
    progress += Math.round(completedTasks / 3 * 20);
    return Math.min(progress, 100);
  };

  // Load today's progress
  const loadTodayProgress = async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const {
      data,
      error
    } = await supabase.from('user_daily_progress').select('*').eq('user_id', user.id).eq('date', today).maybeSingle();
    if (data) {
      setTodayProgress(data);
      setDailyTasks({
        workout: data.treino_realizado || false,
        diet: data.dieta_seguida || false,
        motivation: false // Remove motivacao_lida for now
      });
    } else {
      setDailyTasks({
        workout: false,
        diet: false,
        motivation: false
      });
    }
  };

  // Toggle daily task - Melhorado para funcionar corretamente
  const toggleDailyTask = async (taskType: 'workout' | 'diet' | 'motivation') => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const newTaskState = !dailyTasks[taskType];
    try {
      let updateData: any = {
        user_id: user.id,
        date: today,
        treino_realizado: taskType === 'workout' ? newTaskState : dailyTasks.workout,
        dieta_seguida: taskType === 'diet' ? newTaskState : dailyTasks.diet
      };
      if (todayProgress) {
        // Atualizar registro existente
        const {
          error
        } = await supabase.from('user_daily_progress').update(updateData).eq('id', todayProgress.id);
        if (error) {
          console.error('Erro ao atualizar progresso:', error);
          toast({
            title: "Erro",
            description: "Não foi possível atualizar o progresso",
            variant: "destructive"
          });
          return;
        }
      } else {
        // Criar novo registro
        const {
          data,
          error
        } = await supabase.from('user_daily_progress').insert(updateData).select().single();
        if (error) {
          console.error('Erro ao criar progresso:', error);
          toast({
            title: "Erro",
            description: "Não foi possível criar o progresso",
            variant: "destructive"
          });
          return;
        }
        setTodayProgress(data);
      }

      // Atualizar estado local apenas se a operação foi bem-sucedida
      setDailyTasks(prev => ({
        ...prev,
        [taskType]: newTaskState
      }));

      // Mostrar feedback positivo
      const taskNames = {
        workout: 'Treino',
        diet: 'Dieta',
        motivation: 'Motivação'
      };
      toast({
        title: "Sucesso!",
        description: `${taskNames[taskType]} ${newTaskState ? 'marcado' : 'desmarcado'} com sucesso!`
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
      loadPersonalData();
      loadDietData();
      loadWorkoutData();
      loadUserPhotos();
      loadTodayProgress();
      checkEvaluationAccess();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    try {
      console.log('Carregando dados do usuário:', user.id);
      
      // Usar maybeSingle em vez de single para evitar erro de múltiplas linhas
      const { data, error } = await supabase
        .from('teste_app')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log('Resultado da consulta teste_app:', { data, error });

      if (data && !error) {
        // Calcular dias no app baseado na data de registro
        const calculatedDays = calculateDaysInApp(data.data_registro);
        console.log('Dias calculados no app:', calculatedDays);
        
        setDiasNoApp(calculatedDays);
        setUserData(data);
        setUserName(data.nome || 'Usuário');
      } else {
        console.log('Erro ao carregar dados do usuário:', error);
        setUserName('Usuário');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      setUserName('Usuário');
    }
  };

  const checkEvaluationAccess = async () => {
    if (!user) return;
    
    try {
      console.log('Verificando acesso à avaliação para usuário:', user.id);
      
      const { data: accessData, error } = await supabase
        .from('user_evaluation_access')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('Dados de acesso à avaliação:', { accessData, error });

      if (accessData) {
        // Verificar se já passou dos 7 dias
        const unlockDate = new Date(accessData.unlock_date);
        const today = new Date();
        const isUnlocked = today >= unlockDate;
        
        console.log('Verificação de desbloqueio:', {
          unlockDate: accessData.unlock_date,
          today: today.toISOString().split('T')[0],
          isUnlocked,
          storedIsUnlocked: accessData.is_unlocked
        });

        setEvaluationUnlocked(isUnlocked);

        // Atualizar o status no banco se necessário
        if (isUnlocked && !accessData.is_unlocked) {
          console.log('Atualizando status de desbloqueio no banco...');
          const { error: updateError } = await supabase
            .from('user_evaluation_access')
            .update({ is_unlocked: true })
            .eq('user_id', user.id);

          if (updateError) {
            console.error('Erro ao atualizar status de desbloqueio:', updateError);
          } else {
            console.log('Status de desbloqueio atualizado com sucesso');
          }
        }
      } else {
        console.log('Nenhum dado de acesso à avaliação encontrado');
        setEvaluationUnlocked(false);
      }
    } catch (error) {
      console.error('Erro ao verificar acesso à avaliação:', error);
      setEvaluationUnlocked(false);
    }
  };

  const loadPersonalData = async () => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.from('user_personal_data').select('*').eq('user_id', user.id).single();
      if (data && !error) {
        setPersonalData(data);
        // Se temos dados pessoais mas não temos nome no userData, usar o nome dos dados pessoais
        if (data.nome_completo && !userName) {
          setUserName(data.nome_completo);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados pessoais:', error);
    }
  };
  const loadDietData = async () => {
    if (!user) return;
    const {
      data,
      error
    } = await supabase.from('user_quiz_data').select('*').eq('user_id', user.id).eq('quiz_type', 'alimentar').single();
    if (data) {
      setDietData(data);
    }
  };
  const loadWorkoutData = async () => {
    if (!user) return;
    const {
      data,
      error
    } = await supabase.from('user_quiz_data').select('*').eq('user_id', user.id).eq('quiz_type', 'treino').single();
    if (data) {
      setWorkoutData(data);
    }
  };
  const loadUserPhotos = async () => {
    if (!user) return;
    const {
      data,
      error
    } = await supabase.from('evaluation_photos').select('*').eq('user_id', user.id);
    if (data) {
      setUserPhotos(data);
    }
  };

  // Handler for when profile is updated
  const handleProfileUpdate = () => {
    loadUserData();
    loadPersonalData();
  };

  // Priorizar nome dos dados pessoais se disponível
  const displayName = personalData?.nome_completo || userName || 'Usuário';
  
  const dockItems = [{
    icon: <TrendingUp size={iconSize} />,
    label: 'Dashboard',
    onClick: () => setCurrentTab('dashboard')
  }, {
    icon: <Coffee size={iconSize} />,
    label: 'Dieta',
    onClick: () => navigate('/dashboard/dieta')
  }, {
    icon: <Dumbbell size={iconSize} />,
    label: 'Treinos',
    onClick: () => navigate('/dashboard/treino')
  }, {
    icon: <Camera size={iconSize} />,
    label: 'Avaliação',
    onClick: () => evaluationUnlocked ? navigate('/avaliacao') : setCurrentTab('avaliacao')
  }, {
    icon: <User size={iconSize} />,
    label: 'Perfil',
    onClick: () => setCurrentTab('perfil')
  }];

  return <div className="flex flex-col w-full min-h-screen justify-center items-center relative bg-gradient-to-br from-sky-50 via-white to-sky-100 transition-colors duration-300">
      
      {/* Ilustrações de fundo - apenas em desktop */}
      <div className="absolute top-10 right-10 opacity-5 hidden lg:block">
        <div className="w-32 h-32 bg-gradient-to-br from-sky-300 to-sky-400 rounded-full flex items-center justify-center">
          <span className="text-4xl">🏃‍♀️</span>
        </div>
      </div>
      
      <div className="absolute bottom-32 left-10 opacity-5 hidden lg:block">
        <div className="w-24 h-24 bg-gradient-to-br from-sky-200 to-sky-300 rounded-full flex items-center justify-center">
          <span className="text-3xl">💪</span>
        </div>
      </div>

      {/* Conteúdo principal com abas - Responsivo */}
      <div className="flex-1 flex items-center justify-center w-full px-2 sm:px-4 pb-24 md:pb-20">
        <motion.div key={currentTab} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3
      }} className="w-full max-w-7xl">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">

            <TabsContent value="dashboard" className="mt-0">
              <div className="text-center space-y-6 md:space-y-8">
                <div className="space-y-2 px-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
                    Olá, {displayName}! 👋
                  </h1>
                  <p className="text-gray-600 text-base sm:text-lg">Vamos para mais um dia incrível?</p>
                </div>
                
                {/* Cards de resumo melhorados - Responsivos */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xs sm:max-w-md mx-auto px-4">
                  <motion.div whileHover={{
                  scale: 1.05,
                  y: -5
                }} className="bg-gradient-to-br from-sky-100 to-sky-200 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-sky-200 shadow-lg">
                    <Calendar className="text-sky-500 mx-auto mb-2 sm:mb-3" size={isMobile ? 24 : 28} />
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Dias no App</p>
                    <p className="font-bold text-gray-800 text-xl sm:text-2xl">
                      {diasNoApp}
                    </p>
                    <p className="text-xs text-sky-500 mt-1">dias consecutivos</p>
                  </motion.div>
                  
                  <motion.div whileHover={{
                  scale: 1.05,
                  y: -5
                }} className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-blue-200 shadow-lg">
                    <TrendingUp className="text-blue-500 mx-auto mb-2 sm:mb-3" size={isMobile ? 24 : 28} />
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Progresso</p>
                    <p className="font-bold text-gray-800 text-xl sm:text-2xl">
                      {calculateProgress()}%
                    </p>
                    <p className="text-xs text-blue-500 mt-1">da jornada</p>
                  </motion.div>
                </div>

                {/* Seção de Séries/Atividades - Responsiva */}
                <div className="w-full max-w-6xl mx-auto space-y-4 px-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-center">Suas Atividades Hoje</h2>
                  
                  {/* Grid responsivo para cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    
                    {/* Card de Série - Dieta da Juju */}
                    <motion.div whileHover={{
                    scale: isMobile ? 1.01 : 1.02,
                    y: isMobile ? -1 : -2
                  }} className="bg-white rounded-xl sm:rounded-2xl border-l-4 border-pink-400 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer col-span-1" onClick={() => navigate('/dashboard/dieta')}>
                      <div className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                            <Coffee className="text-white" size={isMobile ? 16 : 20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg leading-tight">PLANO ALIMENTAR</h3>
                            <p className="text-gray-600 text-xs md:text-sm mt-1 leading-relaxed">Cardápio personalizado da Juju para você se sentir incrível</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Flame size={10} className="text-pink-500 flex-shrink-0" />
                              <span className="text-xs text-pink-600 font-semibold">Nutrição Otimizada</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-2 sm:mt-3">
                          <ChevronRight className="text-gray-400" size={16} />
                        </div>
                      </div>
                    </motion.div>

                    {/* Card de Série - Treino do Basa */}
                    <motion.div whileHover={{
                    scale: isMobile ? 1.01 : 1.02,
                    y: isMobile ? -1 : -2
                  }} className="bg-white rounded-xl sm:rounded-2xl border-l-4 border-sky-400 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer col-span-1" onClick={() => navigate('/dashboard/treino')}>
                      <div className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-sky-400 to-sky-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                            <Dumbbell className="text-white" size={isMobile ? 16 : 20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg leading-tight">TREINO DO BASA</h3>
                            <p className="text-gray-600 text-xs md:text-sm mt-1 leading-relaxed">Exercícios desenvolvidos especialmente para seus objetivos</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Target size={10} className="text-sky-500 flex-shrink-0" />
                              <span className="text-xs text-sky-600 font-semibold">Foco & Resultado</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-2 sm:mt-3">
                          <ChevronRight className="text-gray-400" size={16} />
                        </div>
                      </div>
                    </motion.div>

                    {/* Card de Progresso */}
                    <motion.div whileHover={{
                    scale: isMobile ? 1.01 : 1.02,
                    y: isMobile ? -1 : -2
                  }} className="bg-white rounded-xl sm:rounded-2xl border-l-4 border-green-400 shadow-lg hover:shadow-xl transition-all duration-300 col-span-1 sm:col-span-2 lg:col-span-1">
                      <div className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                              <Activity className="text-white" size={isMobile ? 16 : 20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg leading-tight">ACOMPANHAMENTO</h3>
                              <p className="text-gray-600 text-xs md:text-sm mt-1 leading-relaxed">Monitore sua evolução diária e celebre suas conquistas</p>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-3">
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-pink-400 rounded-full flex-shrink-0"></div>
                                  <span className="text-xs text-gray-600">Dieta</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-sky-400 rounded-full flex-shrink-0"></div>
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
                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{calculateProgress()}%</div>
                            <div className="text-xs text-gray-500">completo</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Nova Seção: Metas do Dia - Separada e Responsiva */}
                <div className="w-full max-w-4xl mx-auto mt-8 sm:mt-12 px-4">
                  <motion.div initial={{
                  opacity: 0,
                  scale: 0.95
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} transition={{
                  delay: 0.3
                }} className="bg-gradient-to-r from-sky-100 to-blue-100 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-sky-200 shadow-lg">
                    <div className="text-center mb-4 sm:mb-6">
                      <h3 className="font-bold text-gray-800 text-xl sm:text-2xl mb-2 sm:mb-3 flex items-center justify-center gap-2 sm:gap-3">
                        <Target size={isMobile ? 24 : 28} className="text-sky-500" />
                        Metas do Dia
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base italic mb-4 sm:mb-6">
                        "Cada pequena ação te aproxima do seu objetivo!"
                      </p>
                    </div>

                    {/* Tarefas diárias interativas - Responsivas */}
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      <motion.button whileHover={{
                      scale: isMobile ? 1.01 : 1.02
                    }} whileTap={{
                      scale: 0.98
                    }} onClick={() => toggleDailyTask('workout')} className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${dailyTasks.workout ? 'bg-sky-100 border-sky-300 text-sky-700 shadow-md' : 'bg-white border-gray-200 hover:border-sky-200 text-gray-600 hover:shadow-md'}`}>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <Dumbbell size={isMobile ? 20 : 24} className={dailyTasks.workout ? 'text-sky-600' : 'text-gray-400'} />
                          <span className="text-sm sm:text-base font-medium">Completei meu treino</span>
                        </div>
                        {dailyTasks.workout ? <CheckCircle size={isMobile ? 20 : 24} className="text-sky-600" /> : <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-300 rounded-full" />}
                      </motion.button>

                      <motion.button whileHover={{
                      scale: isMobile ? 1.01 : 1.02
                    }} whileTap={{
                      scale: 0.98
                    }} onClick={() => toggleDailyTask('diet')} className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${dailyTasks.diet ? 'bg-green-100 border-green-300 text-green-700 shadow-md' : 'bg-white border-gray-200 hover:border-green-200 text-gray-600 hover:shadow-md'}`}>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <Coffee size={isMobile ? 20 : 24} className={dailyTasks.diet ? 'text-green-600' : 'text-gray-400'} />
                          <span className="text-sm sm:text-base font-medium">Segui minha dieta</span>
                        </div>
                        {dailyTasks.diet ? <CheckCircle size={isMobile ? 20 : 24} className="text-green-600" /> : <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-300 rounded-full" />}
                      </motion.button>

                      <motion.button whileHover={{
                      scale: isMobile ? 1.01 : 1.02
                    }} whileTap={{
                      scale: 0.98
                    }} onClick={() => toggleDailyTask('motivation')} className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${dailyTasks.motivation ? 'bg-pink-100 border-pink-300 text-pink-700 shadow-md' : 'bg-white border-gray-200 hover:border-pink-200 text-gray-600 hover:shadow-md'}`}>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <Flame size={isMobile ? 20 : 24} className={dailyTasks.motivation ? 'text-pink-600' : 'text-gray-400'} />
                          <span className="text-sm sm:text-base font-medium">Li minha motivação</span>
                        </div>
                        {dailyTasks.motivation ? <CheckCircle size={isMobile ? 20 : 24} className="text-pink-600" /> : <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-300 rounded-full" />}
                      </motion.button>
                    </div>

                    {/* Progresso do dia - Responsivo */}
                    <div className="text-center">
                      <div className="flex justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        {Object.values(dailyTasks).map((completed, index) => <div key={index} className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${completed ? 'bg-gradient-to-r from-sky-400 to-blue-400 shadow-md' : 'bg-gray-200'}`} />)}
                      </div>
                      <p className="text-sky-600 text-sm sm:text-base font-semibold">
                        {Object.values(dailyTasks).filter(Boolean).length}/3 metas concluídas hoje
                      </p>
                      
                      {/* Barra de progresso visual - Responsivo */}
                      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mt-3 sm:mt-4">
                        <div className="bg-gradient-to-r from-sky-400 to-blue-400 h-2 sm:h-3 rounded-full transition-all duration-500 ease-out" style={{
                        width: `${Object.values(dailyTasks).filter(Boolean).length / 3 * 100}%`
                      }} />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="avaliacao" className="mt-0">
              <div className="text-center space-y-6 px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Avaliação 📸</h2>
                {evaluationUnlocked ? (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 sm:p-8 rounded-2xl border border-green-200 max-w-sm sm:max-w-md mx-auto">
                    <CheckCircle className="text-green-500 mx-auto mb-4" size={isMobile ? 40 : 48} />
                    <p className="text-green-700 font-semibold mb-2">✅ Área Desbloqueada!</p>
                    <p className="text-gray-600 mb-4">
                      Parabéns! Você completou {diasNoApp} dias no app e agora pode acessar a área de avaliação.
                    </p>
                    <button
                      onClick={() => navigate('/avaliacao')}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold"
                    >
                      Acessar Avaliação
                    </button>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-8 rounded-2xl border border-gray-200 max-w-sm sm:max-w-md mx-auto">
                    <Camera className="text-gray-400 mx-auto mb-4" size={isMobile ? 40 : 48} />
                    <p className="text-gray-600 mb-2">Liberação em:</p>
                    <p className="text-xl sm:text-2xl font-bold text-sky-600">
                      {Math.max(0, 7 - diasNoApp)} dias
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Você está há {diasNoApp} dias no app. Continue seguindo seu plano! 💪
                    </p>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-sky-400 to-sky-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((diasNoApp / 7) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="perfil" className="mt-0">
              <div className="text-center space-y-6 px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Perfil 👤</h2>
                <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-4 sm:p-6 rounded-2xl border border-sky-200 max-w-sm sm:max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-sky-400 to-sky-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xl sm:text-2xl">👩‍💪</span>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-gray-800 text-lg">{displayName}</p>
                    {userData ? <>
                        <p className="text-gray-600 text-sm sm:text-base">{userData.email}</p>
                        <p className="text-gray-600 text-sm sm:text-base">{userData.whatsapp}</p>
                        <div className="pt-2 space-y-1">
                          <p className="text-sm text-gray-500">
                            Membro desde: {new Date(userData.created_at).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-sm text-gray-500">
                            Dias no app: {diasNoApp} dias
                          </p>
                          <div className="flex justify-center gap-3 sm:gap-4 pt-2">
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
                      </> : <p className="text-gray-500">Carregando dados...</p>}
                  </div>
                  <button onClick={() => setIsEditModalOpen(true)} className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 sm:px-6 py-2 rounded-xl hover:from-sky-600 hover:to-sky-700 transition-all text-sm sm:text-base">
                    Editar Perfil
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Dock na parte inferior - Responsivo */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 sm:pb-6 md:pb-8 z-10">
        <Dock items={dockItems} panelHeight={isMobile ? 60 : 68} baseItemSize={isMobile ? 45 : 50} magnification={isMobile ? 60 : 70} />
      </div>

      {/* Instrução - Responsiva */}
      <p className="fixed bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 text-center text-xs text-gray-400 px-4">
        Navegue pelas opções no dock 💕
      </p>

      {/* Modal de Edição de Perfil */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} userData={userData} onUpdate={handleProfileUpdate} />
    </div>;
};
export default AppJujuDashboard;
