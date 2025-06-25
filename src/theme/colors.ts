// ============================================================================
// SISTEMA DE CORES - JUJU GIRL FIT
// ============================================================================

export const colors = {
  // Cores primárias (rosa/pink)
  primary: {
    50: '#fdf2f8',   // Rosa muito claro
    100: '#fce7f3',  // Rosa claro
    200: '#fbcfe8',  // Rosa suave
    300: '#f9a8d4',  // Rosa médio claro
    400: '#f472b6',  // Rosa médio
    500: '#ec4899',  // Rosa principal
    600: '#db2777',  // Rosa escuro
    700: '#be185d',  // Rosa muito escuro
    800: '#9d174d',  // Rosa profundo
    900: '#831843',  // Rosa mais escuro
  },

  // Cores secundárias (azul para contraste)
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Cores neutras
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5', 
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Cores de estado
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  // Cores especiais para fitness
  fitness: {
    pink: '#ec4899',
    coral: '#f472b6',
    lavender: '#ddd6fe',
    mint: '#6ee7b7',
    peach: '#fed7d7',
  }
};

// Gradientes predefinidos
export const gradients = {
  primary: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
  secondary: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
  background: 'linear-gradient(135deg, #fce7f3 0%, #ffffff 50%, #fdf2f8 100%)',
  card: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%)',
  button: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  accent: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
};

// Sombras padronizadas
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  pink: '0 10px 15px -3px rgb(236 72 153 / 0.3), 0 4px 6px -4px rgb(236 72 153 / 0.3)',
};

// Bordas
export const borderRadius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem',   // 32px
  full: '9999px',
};

// Espaçamentos
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '5rem',   // 80px
}; 