
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DadosPessoais = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome_completo: '',
    data_nascimento: '',
    altura: '',
    peso_atual: '',
    sexo: '',
    nivel_atividade: '',
    objetivo_principal: '',
    restricoes_alimentares: '',
    historico_medico: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Verificar se já tem dados pessoais
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
        // Se já tem dados, preencher o formulário com os dados existentes
        console.log('Dados pessoais já existem, preenchendo formulário');
        setFormData({
          nome_completo: data.nome_completo || '',
          data_nascimento: data.data_nascimento || '',
          altura: data.altura?.toString() || '',
          peso_atual: data.peso_atual?.toString() || '',
          sexo: data.sexo || '',
          nivel_atividade: data.nivel_atividade || '',
          objetivo_principal: data.objetivo_principal || '',
          restricoes_alimentares: data.restricoes_alimentares || '',
          historico_medico: data.historico_medico || ''
        });
      }
    } catch (error) {
      console.error('Erro ao verificar dados existentes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Converter altura e peso para números
      const dataToSave = {
        ...formData,
        user_id: user.id,
        altura: parseFloat(formData.altura),
        peso_atual: parseFloat(formData.peso_atual)
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
      
      // Redirecionar para o próximo passo do fluxo (quiz alimentar)
      navigate('/quiz-alimentar/1');
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao salvar dados');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome Completo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                name="nome_completo"
                value={formData.nome_completo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                placeholder="Seu nome completo"
                required
              />
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data de Nascimento *
              </label>
              <input
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Altura e Peso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Altura (cm) *
                </label>
                <input
                  type="number"
                  name="altura"
                  value={formData.altura}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                  placeholder="Ex: 165"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Peso Atual (kg) *
                </label>
                <input
                  type="number"
                  name="peso_atual"
                  value={formData.peso_atual}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                  placeholder="Ex: 65"
                  step="0.1"
                  required
                />
              </div>
            </div>

            {/* Sexo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sexo *
              </label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                required
              >
                <option value="">Selecione seu sexo</option>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
              </select>
            </div>

            {/* Nível de Atividade */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nível de Atividade Física *
              </label>
              <select
                name="nivel_atividade"
                value={formData.nivel_atividade}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                required
              >
                <option value="">Selecione seu nível</option>
                <option value="sedentario">Sedentário (pouco ou nenhum exercício)</option>
                <option value="leve">Levemente ativo (exercício leve 1-3 dias/semana)</option>
                <option value="moderado">Moderadamente ativo (exercício moderado 3-5 dias/semana)</option>
                <option value="intenso">Muito ativo (exercício intenso 6-7 dias/semana)</option>
                <option value="extremo">Extremamente ativo (exercício muito intenso)</option>
              </select>
            </div>

            {/* Objetivo Principal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Objetivo Principal *
              </label>
              <select
                name="objetivo_principal"
                value={formData.objetivo_principal}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                required
              >
                <option value="">Selecione seu objetivo</option>
                <option value="perder_peso">Perder peso</option>
                <option value="ganhar_massa">Ganhar massa muscular</option>
                <option value="manter_peso">Manter peso atual</option>
                <option value="melhorar_condicionamento">Melhorar condicionamento físico</option>
                <option value="tonificar">Tonificar o corpo</option>
              </select>
            </div>

            {/* Restrições Alimentares */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Restrições Alimentares
              </label>
              <textarea
                name="restricoes_alimentares"
                value={formData.restricoes_alimentares}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all resize-none"
                placeholder="Ex: Intolerância à lactose, vegetariano, alergia a frutos do mar..."
                rows={3}
              />
            </div>

            {/* Histórico Médico */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Histórico Médico Relevante
              </label>
              <textarea
                name="historico_medico"
                value={formData.historico_medico}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all resize-none"
                placeholder="Ex: Diabetes, hipertensão, lesões anteriores, cirurgias..."
                rows={3}
              />
            </div>

            {/* Botão de Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar e Continuar 💪'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DadosPessoais;
