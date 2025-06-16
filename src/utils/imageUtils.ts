
// Utilitários para otimização de imagens

export const compressImage = (file: File, quality: number = 0.8, maxWidth: number = 1024): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular dimensões mantendo proporção
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Desenhar imagem redimensionada
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Converter para base64 com compressão
      const compressedDataURL = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataURL);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Cache simples para imagens já carregadas
const imageCache = new Map<string, string>();

export const getCachedImage = (key: string): string | null => {
  return imageCache.get(key) || null;
};

export const setCachedImage = (key: string, value: string): void => {
  imageCache.set(key, value);
};
