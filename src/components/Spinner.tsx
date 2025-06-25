import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'pink' | 'blue' | 'green' | 'purple' | 'gray';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = 'pink', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4'
  };

  const colorClasses = {
    pink: 'border-pink-200 border-t-pink-500',
    blue: 'border-blue-200 border-t-blue-500',
    green: 'border-green-200 border-t-green-500',
    purple: 'border-purple-200 border-t-purple-500',
    gray: 'border-gray-200 border-t-gray-500'
  };

  return (
    <div className="relative flex items-center justify-center">
      <div className={cn(
        'rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )} />
      
      {/* Segundo anel para efeito adicional */}
      <div className={cn(
        'absolute inset-0 rounded-full animate-pulse border-4 border-transparent',
        sizeClasses[size].replace('border-2', 'border-4').replace('border-4', 'border-4'),
        colorClasses[color].replace('-500', '-300')
      )} />
    </div>
  );
};

export default Spinner; 