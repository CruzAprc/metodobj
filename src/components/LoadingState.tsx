// ============================================================================
// LOADING STATES - COMPONENTES DE CARREGAMENTO
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Heart } from 'lucide-react';
import { gradients } from '@/theme/colors';

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  type?: 'spinner' | 'dots' | 'pulse' | 'heartbeat';
  fullScreen?: boolean;
  transparent?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  size = 'md',
  message = 'Carregando...',
  type = 'spinner',
  fullScreen = false,
  transparent = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center z-50' 
    : 'flex items-center justify-center p-4';

  const backgroundStyle = fullScreen && !transparent 
    ? { background: gradients.background }
    : transparent 
    ? { backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(4px)' }
    : {};

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return (
          <Loader2 
            className={`${sizeClasses[size]} text-pink-500 animate-spin`} 
          />
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-pink-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-pink-400 to-pink-600`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );

      case 'heartbeat':
        return (
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Heart className={`${sizeClasses[size]} text-pink-500 fill-pink-500`} />
          </motion.div>
        );

      default:
        return (
          <Loader2 
            className={`${sizeClasses[size]} text-pink-500 animate-spin`} 
          />
        );
    }
  };

  return (
    <div className={containerClasses} style={backgroundStyle}>
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          {renderLoader()}
        </div>
        {message && (
          <p className="text-gray-600 font-medium text-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

// Skeleton Loading para listas
interface SkeletonProps {
  lines?: number;
  height?: string;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ 
  lines = 3, 
  height = 'h-4', 
  className = '' 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className={`bg-pink-100 rounded-md ${height} mb-2`} />
      ))}
    </div>
  );
};

// Loading para Cards
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-200/30 p-6 animate-pulse ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-pink-100 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-pink-100 rounded mb-2 w-3/4"></div>
          <div className="h-3 bg-pink-50 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-pink-100 rounded"></div>
        <div className="h-3 bg-pink-100 rounded w-5/6"></div>
        <div className="h-3 bg-pink-100 rounded w-4/6"></div>
      </div>
    </div>
  );
};

// Loading para Imagens
interface ImageLoadingProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const ImageWithLoading: React.FC<ImageLoadingProps> = ({
  src,
  alt,
  className = '',
  containerClassName = ''
}) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <div className={`relative ${containerClassName}`}>
      {loading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-pink-50 rounded-lg ${className}`}>
          <LoadingState size="sm" message="" type="pulse" />
        </div>
      )}
      
      {error ? (
        <div className={`flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 ${className}`}>
          <span className="text-sm">Erro ao carregar</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          loading="lazy"
        />
      )}
    </div>
  );
};

// Loading para botões
interface LoadingButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`relative ${className} ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        </div>
      )}
      <span className={loading ? 'invisible' : 'visible'}>
        {children}
      </span>
    </button>
  );
};

export default LoadingState; 