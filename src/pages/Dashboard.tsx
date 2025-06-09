
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
  AlertCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import EditProfileModal from '@/components/EditProfileModal';

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
  const [userName, setUserName] = useState('Juju');
  const [userData, setUserData] = useState<any>(null);
  const [dietData, setDietData] = useState<any>(null);
  const [workoutData, setWorkoutData] = useState<any>(null);
  const [userPhotos, setUserPhotos] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dietLoading, setDietLoading] = useState(false);
  const [dietError, setDietError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { user } = useAuth();

  const iconSize = 22;

  // Mock data para demonstração da nova dieta
  const mockDietData = {
    cafeDaManha: {
      nome: "Café da Manhã Energético",
      horario: "07:00",
      calorias: 350,
      macros: { proteina: 25, carboidrato: 35, gordura: 12 },
      alimentos: [
        { nome: "Ovos mexidos", quantidade: "2 unidades", calorias: 140 },
        { nome: "Pão integral", quantidade: "2 fatias", calorias: 120 },
        { nome: "Abacate", quantidade: "1/4 unidade", calorias: 90 }
      ]
    },
    almoco: {
      nome: "Almoço Balanceado", 
      horario: "12:30",
      calorias: 450,
      macros: { proteina: 35, carboidrato: 45, gordura: 15 },
      alimentos: [
        { nome: "Peito de frango grelhado", quantidade: "150g", calorias: 250 },
        { nome: "Arroz integral", quantidade: "3 colheres", calorias: 120 },
        { nome: "Salada verde", quantidade: "1 prato", calorias: 50 },
        { nome: "Feijão", quantidade: "1 concha", calorias: 80 }
      ]
    },
    lanche: {
      nome: "Lanche da Tarde",
      horario: "15:30", 
      calorias: 200,
      macros: { proteina: 20, carboidrato: 15, gordura: 8 },
      alimentos: [
        { nome: "Whey protein", quantidade: "1 scoop", calorias: 120 },
        { nome: "Banana", quantidade: "1 unidade", calorias: 80 }
      ]
    },
    jantar: {
      nome: "Jantar Leve",
      horario: "19:00",
      calorias: 350,
      macros: { proteina: 30, carboidrato: 25, gordura: 12 },
      alimentos: [
        { nome: "Salmão grelhado", quantidade: "120g", calorias: 200 },
        { nome: "Batata doce", quantidade: "100g", calorias: 90 },
        { nome: "Brócolis refogado", quantidade: "1 xícara", calorias: 60 }
      ]
    },
    ceia: {
      nome: "Ceia Opcional",
      horario: "21:30",
      calorias: 150,
      macros: { proteina: 15, carboidrato: 8, gordura: 6 },
      alimentos: [
        { nome: "Iogurte natural", quantidade: "1 pote", calorias: 100 },
        { nome: "Chia", quantidade: "1 colher", calorias: 50 }
      ]
    }
  };

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      loadUserData();
      loadDietData();
      loadWorkoutData();
      loadUserPhotos();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('teste_app')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (data) {
      setUserData(data);
      setUserName(data.nome); // Update userName when loading user data
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
    loadUserData(); // This will refresh userData and update userName
  };

  // Simular carregamento de dieta atualizada
  const simulateNewDietData = async () => {
    setDietLoading(true);
    setDietError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastUpdate(new Date());
    } catch (err) {
      setDietError("Erro ao carregar dados da dieta");
    } finally {
      setDietLoading(false);
    }
  };

  // Configuração das refeições
  const refeicoes = [
    {
      id: 'cafeDaManha',
      nome: 'Café da Manhã',
      emoji: '☀️',
      icon: <Coffee className="text-orange-500" size={24} />,
      cor: 'from-orange-100 to-orange-200 border-orange-200',
      corTexto: 'text-orange-700'
    },
    {
      id: 'almoco',
      nome: 'Almoço',
      emoji: '🍽️',
      icon: <Utensils className="text-green-500" size={24} />,
      cor: 'from-green-100 to-green-200 border-green-200',
      corTexto: 'text-green-700'
    },
    {
      id: 'lanche',
      nome: 'Lanche',
      emoji: '🥪',
      icon: <Sandwich className="text-yellow-500" size={24} />,
      cor: 'from-yellow-100 to-yellow-200 border-yellow-200',
      corTexto: 'text-yellow-700'
    },
    {
      id: 'jantar',
      nome: 'Jantar',
      emoji: '🌙',
      icon: <Moon className="text-blue-500" size={24} />,
      cor: 'from-blue-100 to-blue-200 border-blue-200',
      corTexto: 'text-blue-700'
    },
    {
      id: 'ceia',
      nome: 'Ceia',
      emoji: '🌟',
      icon: <Moon className="text-purple-500" size={24} />,
      cor: 'from-purple-100 to-purple-200 border-purple-200',
      corTexto: 'text-purple-700'
    }
  ];

  const calcularCaloriasTotais = () => {
    return Object.values(mockDietData).reduce((total, refeicao) => total + (refeicao?.calorias || 0), 0);
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
      onClick: () => setCurrentTab('dieta')
    },
    {
      icon: <Dumbbell size={iconSize} />,
      label: 'Treinos',
      onClick: () => setCurrentTab('treinos')
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
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                    Olá, {userName}! 👋
                  </h1>
                  <p className="text-gray-600 text-lg">Pronta para mais um dia incrível?</p>
                </div>
                
                {/* Cards de resumo */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-pink-100 to-pink-200 p-4 rounded-2xl border border-pink-200"
                  >
                    <Calendar className="text-pink-500 mx-auto mb-2" size={24} />
                    <p className="text-sm text-gray-600">Dias no App</p>
                    <p className="font-bold text-gray-800">
                      {userData?.dias_no_app || 0} dias
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-2xl border border-purple-200"
                  >
                    <TrendingUp className="text-purple-500 mx-auto mb-2" size={24} />
                    <p className="text-sm text-gray-600">Progresso</p>
                    <p className="font-bold text-gray-800">
                      {calculateProgress()}%
                    </p>
                  </motion.div>
                </div>

                {/* Detalhes do progresso */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto border border-gray-100"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Detalhes do Progresso</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className={userData?.quiz_alimentar_concluido ? 'text-green-600' : 'text-gray-500'}>
                        Quiz Alimentar
                      </span>
                      <span className={userData?.quiz_alimentar_concluido ? 'text-green-600 font-bold' : 'text-gray-400'}>
                        {userData?.quiz_alimentar_concluido ? '✓ 25%' : '○ 0%'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={userData?.quiz_treino_concluido ? 'text-green-600' : 'text-gray-500'}>
                        Quiz Treino
                      </span>
                      <span className={userData?.quiz_treino_concluido ? 'text-green-600 font-bold' : 'text-gray-400'}>
                        {userData?.quiz_treino_concluido ? '✓ 25%' : '○ 0%'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={userPhotos.length > 0 ? 'text-green-600' : 'text-gray-500'}>
                        Fotos de Avaliação
                      </span>
                      <span className={userPhotos.length > 0 ? 'text-green-600 font-bold' : 'text-gray-400'}>
                        {userPhotos.length > 0 ? `✓ ${Math.round(Math.min([...new Set(userPhotos.map(photo => photo.photo_type))].length / 3, 1) * 30)}%` : '○ 0%'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600">
                        Dias de Uso ({userData?.dias_no_app || 0}/30)
                      </span>
                      <span className="text-blue-600 font-bold">
                        {Math.round(Math.min((userData?.dias_no_app || 0) / 30, 1) * 20)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="dieta" className="mt-0">
              <div className="space-y-6">
                {/* Header da dieta */}
                <div className="bg-white/80 backdrop-blur-sm border border-pink-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                        <ChefHat className="text-white" size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">Sua Dieta 🍽️</h2>
                        <p className="text-sm text-gray-600">Plano alimentar personalizado</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>Atualizado: {lastUpdate.toLocaleTimeString()}</span>
                      </div>
                      <button
                        onClick={simulateNewDietData}
                        className="mt-1 text-pink-600 hover:text-pink-700 transition-colors"
                        disabled={dietLoading}
                      >
                        <RefreshCw size={16} className={dietLoading ? 'animate-spin' : ''} />
                      </button>
                    </div>
                  </div>
                </div>

                {userData?.quiz_alimentar_concluido ? (
                  <>
                    {/* Resumo diário */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <Calendar className="text-pink-500" size={24} />
                        <h3 className="text-xl font-bold text-gray-800">Resumo do Dia</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
                          <p className="text-2xl font-bold text-pink-600">{calcularCaloriasTotais()}</p>
                          <p className="text-sm text-gray-600">Calorias Totais</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                          <p className="text-2xl font-bold text-blue-600">5</p>
                          <p className="text-sm text-gray-600">Refeições</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                          <p className="text-2xl font-bold text-green-600">Saudável</p>
                          <p className="text-sm text-gray-600">Objetivo</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                          <CheckCircle className="text-purple-600 mx-auto mb-1" size={24} />
                          <p className="text-sm text-gray-600">Plano Ativo</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Grid de refeições */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {refeicoes.map((tipoRefeicao, index) => {
                        const refeicaoData = mockDietData[tipoRefeicao.id];
                        
                        return (
                          <motion.div
                            key={tipoRefeicao.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-gradient-to-br ${tipoRefeicao.cor} rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105`}
                          >
                            {/* Header da refeição */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                  {tipoRefeicao.icon}
                                </div>
                                <div>
                                  <h4 className={`font-bold ${tipoRefeicao.corTexto}`}>
                                    {tipoRefeicao.nome}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {refeicaoData?.horario || '--:--'}
                                  </p>
                                </div>
                              </div>
                              <span className="text-2xl">{tipoRefeicao.emoji}</span>
                            </div>

                            {/* Informações nutricionais */}
                            {refeicaoData && (
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Calorias:</span>
                                  <span className={`font-bold ${tipoRefeicao.corTexto}`}>
                                    {refeicaoData.calorias} kcal
                                  </span>
                                </div>
                                
                                {/* Macros */}
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div className="text-center p-2 bg-white/50 rounded-lg">
                                    <p className="font-medium">Proteína</p>
                                    <p className={tipoRefeicao.corTexto}>{refeicaoData.macros.proteina}g</p>
                                  </div>
                                  <div className="text-center p-2 bg-white/50 rounded-lg">
                                    <p className="font-medium">Carbo</p>
                                    <p className={tipoRefeicao.corTexto}>{refeicaoData.macros.carboidrato}g</p>
                                  </div>
                                  <div className="text-center p-2 bg-white/50 rounded-lg">
                                    <p className="font-medium">Gordura</p>
                                    <p className={tipoRefeicao.corTexto}>{refeicaoData.macros.gordura}g</p>
                                  </div>
                                </div>

                                {/* Lista de alimentos */}
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-gray-700">Alimentos:</p>
                                  <div className="space-y-1 max-h-32 overflow-y-auto">
                                    {refeicaoData.alimentos.map((alimento, idx) => (
                                      <div key={idx} className="text-xs bg-white/30 p-2 rounded-lg">
                                        <div className="flex justify-between">
                                          <span className="font-medium">{alimento.nome}</span>
                                          <span className={tipoRefeicao.corTexto}>{alimento.calorias} kcal</span>
                                        </div>
                                        <p className="text-gray-600">{alimento.quantidade}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Footer com informações */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-center"
                    >
                      <p className="text-sm text-gray-500">
                        💡 Sua dieta é atualizada automaticamente baseada nas suas preferências
                      </p>
                    </motion.div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
                      <AlertCircle className="text-gray-400 mx-auto mb-4" size={48} />
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Dieta em Preparação</h3>
                      <p className="text-gray-500 text-lg mb-4">Complete o quiz alimentar para ver suas refeições personalizadas aqui!</p>
                      <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl">
                        <p className="text-sm text-gray-600">
                          ✨ A Juju está esperando suas preferências para criar o plano perfeito!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="treinos" className="mt-0">
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">Seus Treinos 💪</h2>
                {workoutData ? (
                  <div className="space-y-4 max-w-2xl mx-auto">
                    <div className="text-left bg-white p-6 rounded-2xl shadow-lg">
                      <h3 className="text-xl font-bold mb-4 text-pink-600">Perfil de Treino</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-700">Objetivo</h4>
                          <p className="text-sm text-gray-600">{workoutData.objetivo}</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-700">Experiência</h4>
                          <p className="text-sm text-gray-600">{workoutData.experiencia}</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-700">Frequência</h4>
                          <p className="text-sm text-gray-600">{workoutData.frequencia}</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-700">Tempo por Sessão</h4>
                          <p className="text-sm text-gray-600">{workoutData.tempo_sessao}</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-700">Foco</h4>
                          <p className="text-sm text-gray-600">{workoutData.foco_regiao}</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-700">Intensidade</h4>
                          <p className="text-sm text-gray-600">{workoutData.intensidade}</p>
                        </div>

                        {workoutData.lesoes && workoutData.lesoes !== 'nao' && (
                          <div className="space-y-2 md:col-span-2">
                            <h4 className="font-semibold text-gray-700">Lesões/Limitações</h4>
                            <p className="text-sm text-gray-600">
                              {workoutData.lesoes}
                              {workoutData.lesao_especifica && ` - ${workoutData.lesao_especifica}`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Complete o quiz de treino para ver seu perfil aqui!</p>
                  </div>
                )}
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
