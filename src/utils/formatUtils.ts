/**
 * Formata número de telefone/WhatsApp para padrão brasileiro
 */
export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return numbers.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

/**
 * Formata CPF
 */
export const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  return numbers.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata CEP
 */
export const formatCEP = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 8) {
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
  
  return numbers.slice(0, 8).replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Remove caracteres especiais de string
 */
export const removeSpecialChars = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Capitaliza primeira letra de cada palavra
 */
export const capitalizeWords = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Trunca texto com reticências
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}; 