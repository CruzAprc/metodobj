// ============================================================================
// HOOK CUSTOMIZADO - DADOS DO USUÁRIO
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { UserData, PersonalData, DietData, WorkoutData, UserPhoto, ApiResponse } from '@/types';

export const useUserData = () => {
  // Estados tipados
  const [userData, setUserData] = useState<UserData | null>(null);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [dietData, setDietData] = useState<DietData | null>(null);
  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);
  const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  // Função para carregar dados principais do usuário
  const loadUserData = useCallback(async (): Promise<ApiResponse<UserData>> => {
    if (!user) {
      return { data: null, error: 'Usuário não autenticado', loading: false };
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('teste_app')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      const typedData: UserData = {
        id: data.id,
        user_id: data.user_id,
        nome: data.nome,
        email: data.email,
        whatsapp: data.whatsapp,
        data_registro: data.data_registro,
        status: data.status || 'ativo',
        plano: data.plano,
        progresso_total: data.progresso_total,
        dias_no_app: data.dias_no_app,
      };

      setUserData(typedData);
      return { data: typedData, error: null, loading: false };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return { data: null, error: errorMessage, loading: false };
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Função para carregar dados pessoais
  const loadPersonalData = useCallback(async (): Promise<ApiResponse<PersonalData>> => {
    if (!user) {
      return { data: null, error: 'Usuário não autenticado', loading: false };
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('dados_pessoais')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (supabaseError && supabaseError.code !== 'PGRST116') {
        throw new Error(supabaseError.message);
      }

      if (data) {
        const typedData: PersonalData = {
          id: data.id,
          user_id: data.user_id,
          idade: data.idade,
          peso: data.peso,
          altura: data.altura,
          objetivo: data.objetivo,
          nivel_atividade: data.nivel_atividade,
          restricoes_alimentares: data.restricoes_alimentares,
          preferencias: data.preferencias,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        
        setPersonalData(typedData);
        return { data: typedData, error: null, loading: false };
      }

      return { data: null, error: null, loading: false };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados pessoais';
      return { data: null, error: errorMessage, loading: false };
    }
  }, [user]);

  // Função para carregar dados da dieta
  const loadDietData = useCallback(async (): Promise<ApiResponse<DietData>> => {
    if (!user) {
      return { data: null, error: 'Usuário não autenticado', loading: false };
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('user_diet_plan')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (supabaseError && supabaseError.code !== 'PGRST116') {
        throw new Error(supabaseError.message);
      }

      if (data) {
        // Aqui você pode fazer parsing dos dados conforme necessário
        const typedData: DietData = data as DietData;
        setDietData(typedData);
        return { data: typedData, error: null, loading: false };
      }

      return { data: null, error: null, loading: false };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados da dieta';
      return { data: null, error: errorMessage, loading: false };
    }
  }, [user]);

  // Função para carregar dados do treino
  const loadWorkoutData = useCallback(async (): Promise<ApiResponse<WorkoutData>> => {
    if (!user) {
      return { data: null, error: 'Usuário não autenticado', loading: false };
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('user_workout_plan')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (supabaseError && supabaseError.code !== 'PGRST116') {
        throw new Error(supabaseError.message);
      }

      if (data) {
        const typedData: WorkoutData = data as WorkoutData;
        setWorkoutData(typedData);
        return { data: typedData, error: null, loading: false };
      }

      return { data: null, error: null, loading: false };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados do treino';
      return { data: null, error: errorMessage, loading: false };
    }
  }, [user]);

  // Função para carregar fotos do usuário
  const loadUserPhotos = useCallback(async (): Promise<ApiResponse<UserPhoto[]>> => {
    if (!user) {
      return { data: [], error: 'Usuário não autenticado', loading: false };
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('user_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('data_foto', { ascending: false });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      const typedData: UserPhoto[] = data as UserPhoto[];
      setUserPhotos(typedData);
      return { data: typedData, error: null, loading: false };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar fotos';
      return { data: [], error: errorMessage, loading: false };
    }
  }, [user]);

  // Função para recarregar todos os dados
  const refetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        loadUserData(),
        loadPersonalData(),
        loadDietData(),
        loadWorkoutData(),
        loadUserPhotos(),
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao recarregar dados';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadUserData, loadPersonalData, loadDietData, loadWorkoutData, loadUserPhotos]);

  // Carregar dados iniciais
  useEffect(() => {
    if (user) {
      refetchAll();
    }
  }, [user, refetchAll]);

  return {
    // Estados
    userData,
    personalData,
    dietData,
    workoutData,
    userPhotos,
    loading,
    error,
    
    // Funções
    loadUserData,
    loadPersonalData,
    loadDietData,
    loadWorkoutData,
    loadUserPhotos,
    refetchAll,
    
    // Setters (para casos específicos)
    setUserData,
    setPersonalData,
    setDietData,
    setWorkoutData,
    setUserPhotos,
  };
}; 