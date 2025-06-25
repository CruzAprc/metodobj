// ============================================================================
// DOCK COMPONENTS - COMPONENTES DO DOCK SEPARADOS
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { DockItem as DockItemType, DockProps } from '@/types';

// Componente Dock Item
interface DockItemProps {
  children: React.ReactNode;
  onClick: () => void;
  mouseX: any;
  spring: any;
  distance: number;
  magnification: number;
  baseItemSize: number;
  className?: string;
}

export const DockItem: React.FC<DockItemProps> = ({
  children,
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  className = ""
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);
  
  const mouseDistance = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    };
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
                  bg-gradient-to-br from-sky-100 to-sky-200 
                  border-2 border-sky-300/50 shadow-lg 
                  hover:from-sky-200 hover:to-sky-300
                  transition-all duration-300 cursor-pointer
                  ${className}`}
      tabIndex={0}
      role="button"
    >
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child as React.ReactElement<any>, { isHovered })
          : child
      )}
    </motion.div>
  );
};

// Componente Dock Label
interface DockLabelProps {
  children: React.ReactNode;
  isHovered?: any;
}

export const DockLabel: React.FC<DockLabelProps> = ({ children, isHovered }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (!isHovered) return;
    
    const unsubscribe = isHovered.on?.("change", (latest: number) => {
      setIsVisible(latest === 1);
    });
    
    return () => unsubscribe?.();
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
                     rounded-lg border border-sky-200 
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
interface DockIconProps {
  children: React.ReactNode;
}

export const DockIcon: React.FC<DockIconProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center w-full h-full text-sky-600">
      {children}
    </div>
  );
};

// Componente Dock Principal
export const Dock: React.FC<DockProps> = ({
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
}) => {
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
                    border-2 border-sky-200/50
                    pb-3 px-4
                    bg-white/80 backdrop-blur-md 
                    shadow-2xl`}
        style={{ height: panelHeight }}
      >
        {items.map((item: DockItemType, index: number) => (
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