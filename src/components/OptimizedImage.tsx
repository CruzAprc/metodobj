
import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  placeholder = true 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Placeholder enquanto carrega */}
      {isLoading && placeholder && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl flex items-center justify-center">
          <Camera className="text-gray-400" size={32} />
        </div>
      )}

      {/* Imagem principal */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover rounded-2xl transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />

      {/* Fallback para erro */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 rounded-2xl flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Camera size={32} className="mx-auto mb-2" />
            <p className="text-sm">Erro ao carregar</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
