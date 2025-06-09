
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
  TrendingUp
} from 'lucide-react';

// Componente Dock Item
const DockItem = ({ children, onClick, mouseX, spring, distance, magnification, baseItemSize, className = "" }) => {
  const ref = React.useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
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
        React.cloneElement(child, { isHovered })
      )}
    </motion.div>
  );
};

// Componente Dock Label
const DockLabel = ({ children, isHovered }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) => {
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
const DockIcon = ({ children }) => {
  return (
    <div className="flex items-center justify-center w-full h-full text-pink-600">
      {children}
    </div>
  );
};

// Componente Dock Principal
const Dock = ({ items, className = "", spring = { mass: 0.1, stiffness: 150, damping: 12 }, magnification = 70, distance = 200, panelHeight = 64, baseItemSize = 50 }) => {
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
        {items.map((item, index) => (
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
const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userName] = useState('Juju'); // Nome da usuária

  const iconSize = 22;

  const dockItems = [
    {
      icon: <TrendingUp size={iconSize} />,
      label: 'Dashboard',
      onClick: () => setCurrentPage('dashboard')
    },
    {
      icon: <Coffee size={iconSize} />,
      label: 'Dieta',
      onClick: () => setCurrentPage('dieta')
    },
    {
      icon: <Dumbbell size={iconSize} />,
      label: 'Treinos',
      onClick: () => setCurrentPage('treinos')
    },
    {
      icon: <Camera size={iconSize} />,
      label: 'Avaliação',
      onClick: () => setCurrentPage('avaliacao')
    },
    {
      icon: <User size={iconSize} />,
      label: 'Perfil',
      onClick: () => setCurrentPage('perfil')
    }
  ];

  // Componente de cada página
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
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
                <p className="text-sm text-gray-600">Dia</p>
                <p className="font-bold text-gray-800">7/30</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-2xl border border-purple-200"
              >
                <TrendingUp className="text-purple-500 mx-auto mb-2" size={24} />
                <p className="text-sm text-gray-600">Progresso</p>
                <p className="font-bold text-gray-800">85%</p>
              </motion.div>
            </div>
          </div>
        );
      
      case 'dieta':
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Sua Dieta 🍽️</h2>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {[
                { icon: <Coffee size={20} />, label: 'Café da Manhã', color: 'from-orange-100 to-orange-200 border-orange-200' },
                { icon: <Utensils size={20} />, label: 'Almoço', color: 'from-green-100 to-green-200 border-green-200' },
                { icon: <Sandwich size={20} />, label: 'Lanche', color: 'from-yellow-100 to-yellow-200 border-yellow-200' },
                { icon: <Moon size={20} />, label: 'Jantar', color: 'from-blue-100 to-blue-200 border-blue-200' }
              ].map((meal, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-gradient-to-br ${meal.color} p-6 rounded-2xl border cursor-pointer`}
                >
                  <div className="text-gray-600 mb-2">{meal.icon}</div>
                  <p className="font-medium text-gray-700">{meal.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );
      
      case 'treinos':
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Seus Treinos 💪</h2>
            <div className="space-y-4 max-w-md mx-auto">
              {['Segunda - Superiores', 'Terça - Inferiores', 'Quarta - Cardio', 'Quinta - Funcionais'].map((treino, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200 text-left"
                >
                  <p className="font-medium text-gray-800">{treino}</p>
                  <p className="text-sm text-gray-600">45 min • 12 exercícios</p>
                </motion.div>
              ))}
            </div>
          </div>
        );
      
      case 'avaliacao':
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Avaliação 📸</h2>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200 max-w-md mx-auto">
              <Camera className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-gray-600 mb-2">Liberação em:</p>
              <p className="text-2xl font-bold text-pink-600">7 dias</p>
              <p className="text-sm text-gray-500 mt-2">Continue seguindo seu plano! 💪</p>
            </div>
          </div>
        );
      
      case 'perfil':
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Perfil 👤</h2>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl border border-pink-200 max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">👩‍💪</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg">{userName}</p>
                <p className="text-gray-600">Objetivo: Emagrecimento</p>
              </div>
              <button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-2 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all">
                Editar Perfil
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

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

      {/* Conteúdo principal */}
      <div className="flex-1 flex items-center justify-center w-full px-4">
        <motion.div 
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl"
        >
          {renderPage()}
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
    </div>
  );
};

export default Dashboard;
