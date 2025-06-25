import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, User, Calendar, Ruler, 
  Weight, UserCheck, ArrowLeft 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { gradients, colors } from '@/theme/colors';
import LoadingState, { LoadingButton } from '@/components/LoadingState';

interface FormData {
  nome_completo: string;
  data_nascimento: string;
  altura: string;
  peso_atual: string;
  sexo: string;
}

const DadosPessoais = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      nome_completo: '',
      data_nascimento: '',
      altura: '',
      peso_atual: '',
      sexo: '',
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    checkExistingData();
  }, [user, navigate]);

  const checkExistingData = async () => {
    if (!user) return;
    
    try {
      console.log('Verificando dados existentes para user:', user.id);
      
      // Primeiro verificar na nova tabela consolidada
      const { data: profileData, error: profileError } = await supabase
        .from('user_complete_profile')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', profileError);
      }

      if (profileData) {
        console.log('Dados encontrados no perfil consolidado:', profileData);
        form.reset({
          nome_completo: profileData.nome_completo || '',
          data_nascimento: profileData.data_nascimento || '',
          altura: profileData.altura?.toString() || '',
          peso_atual: profileData.peso_atual?.toString() || '',
          sexo: profileData.sexo || '',
        });
        return;
      }

      // Se não encontrou na consolidada, verificar na tabela antiga
      const { data, error } = await supabase
        .from('user_personal_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar dados:', error);
        return;
      }

      if (data) {
        console.log('Dados encontrados na tabela antiga:', data);
        form.reset({
          nome_completo: data.nome_completo || '',
          data_nascimento: data.data_nascimento || '',
          altura: data.altura?.toString() || '',
          peso_atual: data.peso_atual?.toString() || '',
          sexo: data.sexo || '',
        });
      } else {
        console.log('Nenhum dado encontrado');
      }
    } catch (error) {
      console.error('Erro inesperado ao verificar dados existentes:', error);
    }
  };

  const updateCompleteProfile = async (personalData: FormData) => {
    if (!user) return;

    try {
      console.log('Atualizando perfil consolidado com dados pessoais:', personalData);

      const profileData = {
        user_id: user.id,
        nome_completo: personalData.nome_completo.trim(),
        data_nascimento: personalData.data_nascimento,
        altura: parseFloat(personalData.altura),
        peso_atual: parseFloat(personalData.peso_atual),
        sexo: personalData.sexo,
        dados_pessoais_completed: true,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_complete_profile')
        .upsert(profileData, { onConflict: 'user_id' });

      if (error) {
        console.error('Erro ao atualizar perfil consolidado:', error);
        throw error;
      }

      console.log('Perfil consolidado atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar perfil consolidado:', error);
      throw error;
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    console.log('Iniciando submit com dados:', data);
    setIsSubmitting(true);
    
    try {
      // Validar dados antes de enviar
      if (!data.nome_completo.trim()) {
        toast.error('Nome completo é obrigatório');
        setIsSubmitting(false);
        return;
      }

      if (!data.data_nascimento) {
        toast.error('Data de nascimento é obrigatória');
        setIsSubmitting(false);
        return;
      }

      if (!data.altura || isNaN(parseFloat(data.altura))) {
        toast.error('Altura deve ser um número válido');
        setIsSubmitting(false);
        return;
      }

      if (!data.peso_atual || isNaN(parseFloat(data.peso_atual))) {
        toast.error('Peso deve ser um número válido');
        setIsSubmitting(false);
        return;
      }

      if (!data.sexo) {
        toast.error('Sexo é obrigatório');
        setIsSubmitting(false);
        return;
      }

      const dataToSave = {
        user_id: user.id,
        nome_completo: data.nome_completo.trim(),
        data_nascimento: data.data_nascimento,
        altura: parseFloat(data.altura),
        peso_atual: parseFloat(data.peso_atual),
        sexo: data.sexo,
        updated_at: new Date().toISOString()
      };

      console.log('Dados para salvar:', dataToSave);

      // Salvar na tabela original (manter compatibilidade)
      const { data: existingData } = await supabase
        .from('user_personal_data')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let result;
      
      if (existingData) {
        console.log('Atualizando registro existente');
        result = await supabase
          .from('user_personal_data')
          .update(dataToSave)
          .eq('user_id', user.id);
      } else {
        console.log('Inserindo novo registro');
        result = await supabase
          .from('user_personal_data')
          .insert([dataToSave]);
      }

      if (result.error) {
        console.error('Erro na operação do banco:', result.error);
        toast.error('Erro ao salvar dados pessoais: ' + result.error.message);
        return;
      }

      // Atualizar perfil consolidado
      await updateCompleteProfile(data);

      console.log('Dados salvos com sucesso');
      toast.success('Dados salvos com sucesso!');
      
      // Navegar para a próxima página
      navigate('/quiz-alimentar');
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao salvar dados');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 mobile-safe-area" style={{ background: gradients.background }}>
      <div className="w-full max-w-2xl">
        
        {/* Header com navegação responsivo */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-pink-200/30 p-4 sm:p-6 mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white">
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold" style={{ color: colors.primary[600] }}>
                  Dados Pessoais
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Etapa 1 de 3
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/onboarding')}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-gray-600 hover:text-gray-800 hover:bg-white/50 transition-all min-h-[44px]"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Voltar</span>
            </button>
          </div>
        </motion.div>

        {/* Título principal responsivo */}
        <motion.div 
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight" style={{ color: colors.primary[700] }}>
            Seus Dados Pessoais
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto px-4">
            Vamos conhecer você melhor para criar o plano perfeito! 📋
          </p>
        </motion.div>

        {/* Formulário responsivo */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-pink-200/30 p-4 sm:p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nome Completo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <FormField
                  control={form.control}
                  name="nome_completo"
                  rules={{ required: "Nome completo é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold flex items-center gap-2" style={{ color: colors.primary[700] }}>
                        <User size={16} />
                        Nome Completo *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu nome completo"
                          className="px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-sm sm:text-base min-h-[44px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Data de Nascimento */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FormField
                  control={form.control}
                  name="data_nascimento"
                  rules={{ required: "Data de nascimento é obrigatória" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold flex items-center gap-2" style={{ color: colors.primary[700] }}>
                        <Calendar size={16} />
                        Data de Nascimento *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-sm sm:text-base min-h-[44px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Altura e Peso */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name="altura"
                  rules={{ required: "Altura é obrigatória" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold flex items-center gap-2" style={{ color: colors.primary[700] }}>
                        <Ruler size={16} />
                        Altura (cm) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 165"
                          min="100"
                          max="250"
                          className="px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-sm sm:text-base min-h-[44px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="peso_atual"
                  rules={{ required: "Peso atual é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold flex items-center gap-2" style={{ color: colors.primary[700] }}>
                        <Weight size={16} />
                        Peso Atual (kg) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 65"
                          min="30"
                          max="300"
                          step="0.1"
                          className="px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-sm sm:text-base min-h-[44px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Sexo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FormField
                  control={form.control}
                  name="sexo"
                  rules={{ required: "Sexo é obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold flex items-center gap-2" style={{ color: colors.primary[700] }}>
                        <UserCheck size={16} />
                        Sexo *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-sm sm:text-base min-h-[44px]">
                            <SelectValue placeholder="Selecione seu sexo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="feminino">👩 Feminino</SelectItem>
                          <SelectItem value="masculino">👨 Masculino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Botão de Submit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <LoadingButton
                  type="submit"
                  loading={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 
                           text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl 
                           transition-all duration-300 transform hover:scale-[1.02] h-auto min-h-[48px] text-sm sm:text-base"
                >
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <span>Salvar e Continuar</span>
                    <ArrowRight size={18} />
                  </div>
                </LoadingButton>
                
                <div className="text-center mt-4">
                  <p className="text-xs sm:text-sm text-gray-500">
                    📋 Dados Pessoais • Próximo: Alimentar
                  </p>
                </div>
              </motion.div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
};

export default DadosPessoais;
