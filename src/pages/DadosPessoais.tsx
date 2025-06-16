
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const { data, error } = await supabase
        .from('user_personal_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data && !error) {
        console.log('Dados pessoais já existem, preenchendo formulário');
        const personalData = data as any;
        form.reset({
          nome_completo: personalData.nome_completo || '',
          data_nascimento: personalData.data_nascimento || '',
          altura: personalData.altura?.toString() || '',
          peso_atual: personalData.peso_atual?.toString() || '',
          sexo: personalData.sexo || '',
        });
      }
    } catch (error) {
      console.error('Erro ao verificar dados existentes:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dataToSave = {
        ...data,
        user_id: user.id,
        altura: parseFloat(data.altura),
        peso_atual: parseFloat(data.peso_atual)
      };

      const { error } = await supabase
        .from('user_personal_data')
        .upsert(dataToSave, { 
          onConflict: 'user_id' 
        });

      if (error) {
        console.error('Erro ao salvar dados:', error);
        toast.error('Erro ao salvar dados pessoais');
        return;
      }

      console.log('Dados pessoais salvos com sucesso');
      toast.success('Dados salvos com sucesso!');
      
      navigate('/quiz-alimentar/1');
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao salvar dados');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent mb-2">
            Seus Dados Pessoais 📋
          </h1>
          <p className="text-gray-600">
            Vamos conhecer você melhor para criar o plano perfeito!
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nome Completo */}
              <FormField
                control={form.control}
                name="nome_completo"
                rules={{ required: "Nome completo é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Nome Completo *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Seu nome completo"
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data de Nascimento */}
              <FormField
                control={form.control}
                name="data_nascimento"
                rules={{ required: "Data de nascimento é obrigatória" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Data de Nascimento *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Altura e Peso */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="altura"
                  rules={{ required: "Altura é obrigatória" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Altura (cm) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 165"
                          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
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
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Peso Atual (kg) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 65"
                          step="0.1"
                          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sexo */}
              <FormField
                control={form.control}
                name="sexo"
                rules={{ required: "Sexo é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Sexo *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all">
                          <SelectValue placeholder="Selecione seu sexo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="masculino">Masculino</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botão de Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed h-auto"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar e Continuar 💪'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default DadosPessoais;
