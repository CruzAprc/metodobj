// ============================================================================
// TYPES CENTRALIZADOS - JUJU GIRL FIT
// ============================================================================

export interface User {
  id: string;
  email: string;
  nome: string;
  whatsapp: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserData {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  whatsapp: string;
  data_registro: string;
  status: 'ativo' | 'inativo';
  plano?: string;
  progresso_total?: number;
  dias_no_app?: number;
}

export interface PersonalData {
  id: string;
  user_id: string;
  idade: number;
  peso: number;
  altura: number;
  objetivo: string;
  nivel_atividade: string;
  restricoes_alimentares?: string;
  preferencias?: string;
  created_at: string;
  updated_at?: string;
}

export interface DietData {
  id: string;
  user_id: string;
  cafe_da_manha: MealData;
  almoco: MealData;
  lanche: MealData;
  jantar: MealData;
  ceia: MealData;
  observacoes?: string;
  created_at: string;
  updated_at?: string;
}

export interface MealData {
  nome: string;
  horario: string;
  alimentos: string[];
  calorias?: number;
  macros?: {
    proteinas: number;
    carboidratos: number;
    gorduras: number;
  };
}

export interface WorkoutData {
  id: string;
  user_id: string;
  tipo_treino: string;
  frequencia_semanal: number;
  duracao_sessao: number;
  exercicios: ExerciseData[];
  observacoes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ExerciseData {
  nome: string;
  grupo_muscular: string;
  series: number;
  repeticoes: string;
  descanso: string;
  observacoes?: string;
}

export interface UserPhoto {
  id: string;
  user_id: string;
  tipo: 'frente' | 'lado' | 'costas';
  url: string;
  data_foto: string;
  observacoes?: string;
}

export interface DailyProgress {
  id: string;
  user_id: string;
  date: string;
  treino_realizado: boolean;
  dieta_seguida: boolean;
  peso_atual?: number;
  observacoes?: string;
  created_at: string;
}

export interface QuizData {
  id: string;
  user_id: string;
  tipo: 'alimentar' | 'treino';
  respostas: Record<string, any>;
  completo: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: any | null; // User do Supabase
  session: any | null;
  signUp: (email: string, password: string, nome: string, whatsapp: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  forceSignOut: () => Promise<void>;
  loading: boolean;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// Props para componentes
export interface ProgressCalendarProps {
  userData: UserData;
}

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  onUpdate: () => void;
}

export interface TreinoWeekTableProps {
  workoutData: WorkoutData;
}

// Estados de UI
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string | number;
}

// Formulários
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  nome: string;
  whatsapp: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PersonalDataFormData {
  idade: number;
  peso: number;
  altura: number;
  objetivo: string;
  nivel_atividade: string;
  restricoes_alimentares?: string;
  preferencias?: string;
}

// Dock (Dashboard)
export interface DockItem {
  icon: any; // Será tipado quando importar nos componentes
  label: string;
  onClick: () => void;
}

export interface DockProps {
  items: DockItem[];
  className?: string;
  spring?: {
    mass: number;
    stiffness: number;
    damping: number;
  };
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
} 