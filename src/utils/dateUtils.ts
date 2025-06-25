/**
 * Calcula a diferença em dias entre duas datas
 */
export const calculateDaysBetween = (startDate: string | Date, endDate: string | Date = new Date()): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

/**
 * Calcula quantos dias o usuário está usando o app
 */
export const calculateDaysInApp = (registrationDate: string): number => {
  return calculateDaysBetween(registrationDate, new Date());
};

/**
 * Formata uma data para string legível
 */
export const formatDate = (date: string | Date, locale: string = 'pt-BR'): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Verifica se uma data é hoje
 */
export const isToday = (date: string | Date): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  
  return today.toDateString() === checkDate.toDateString();
};

/**
 * Obtém o mês atual no formato YYYY-MM-01 (para comparações com banco)
 */
export const getCurrentMonth = (): string => {
  return new Date().toISOString().slice(0, 7) + '-01';
}; 