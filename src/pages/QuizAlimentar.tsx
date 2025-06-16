import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

interface QuizData {
  objetivo: string;
  restricoes: string[];
  preferenciasAlimentares: string[];
  frequenciaRefeicoes: string;
  nivelAtividade: string;
  alergias: string[];
  suplementos: string[];
  horarioPreferencia: string;
  orcamento: string;
}

const QuizAlimentar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [objetivo, setObjetivo] = useState('');
  const [restricoes, setRestricoes] = useState<string[]>([]);
  const [preferenciasAlimentares, setPreferenciasAlimentares] = useState<string[]>([]);
  const [frequenciaRefeicoes, setFrequenciaRefeicoes] = useState('');
  const [nivelAtividade, setNivelAtividade] = useState('');
  const [alergias, setAlergias] = useState<string[]>([]);
  const [suplementos, setSuplementos] = useState<string[]>([]);
  const [horarioPreferencia, setHorarioPreferencia] = useState('');
  const [orcamento, setOrcamento] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('Quiz alimentar visualizado');
  }, []);

  const handleRestricaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setRestricoes(prev => checked ? [...prev, value] : prev.filter(item => item !== value));
  };

  const handlePreferenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setPreferenciasAlimentares(prev => checked ? [...prev, value] : prev.filter(item => item !== value));
  };

  const handleAlergiaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setAlergias(prev => checked ? [...prev, value] : prev.filter(item => item !== value));
  };

  const handleSuplementoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSuplementos(prev => checked ? [...prev, value] : prev.filter(item => item !== value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error('Usuário não logado');
      return;
    }

    setIsSubmitting(true);

    try {
      const quizData = {
        objetivo,
        restricoes,
        preferenciasAlimentares,
        frequenciaRefeicoes,
        nivelAtividade,
        alergias,
        suplementos,
        horarioPreferencia,
        orcamento
      };

      // Gerar universal_id para este quiz
      const universalId = crypto.randomUUID();

      // Salvar no banco de dados
      const { error: dbError } = await supabase
        .from('user_quiz_data')
        .insert({
          user_id: user.id,
          quiz_type: 'alimentar',
          quiz_data: quizData,
          universal_id: universalId,
          completed_at: new Date().toISOString()
        });

      if (dbError) {
        console.error('Erro ao salvar quiz:', dbError);
        throw dbError;
      }

      // Buscar dados do usuário para enviar no webhook
      const { data: userData } = await supabase
        .from('teste_app')
        .select('email, nome')
        .eq('user_id', user.id)
        .single();

      // Enviar dados para o webhook
      try {
        const webhookPayload = {
          user_id: user.id,
          universal_id: universalId,
          email: userData?.email || user.email,
          nome: userData?.nome || '',
          quiz_type: 'alimentar',
          quiz_data: quizData,
          timestamp: new Date().toISOString()
        };

        console.log('Enviando dados para webhook:', webhookPayload);

        const webhookResponse = await fetch('https://webhook.sv-02.botfai.com.br/webhook/1613f464-324c-494d-945a-efedd0a0dbd5', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload)
        });

        if (!webhookResponse.ok) {
          console.error('Erro no webhook:', webhookResponse.statusText);
        } else {
          console.log('Dados enviados com sucesso para o webhook');
        }
      } catch (webhookError) {
        console.error('Erro ao enviar para webhook:', webhookError);
        // Não impedir o fluxo se o webhook falhar
      }

      console.log('Quiz salvo com sucesso!');
      
      // Registrar evento de conclusão
      await supabase.rpc('log_user_event', {
        p_user_id: user.id,
        p_event_type: 'quiz_alimentar_completed',
        p_event_data: quizData
      });

      // Redirecionar para o dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <Header 
        showBack={true} 
        onBack={() => navigate('/dashboard')}
        title="Questionário Alimentar"
      />
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Nos diga sobre seus hábitos alimentares
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="objetivo" className="block text-sm font-medium text-gray-700">
                Qual é o seu principal objetivo?
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="objetivo"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Você possui alguma restrição alimentar?
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="restricao-vegetariano"
                      type="checkbox"
                      value="vegetariano"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={restricoes.includes('vegetariano')}
                      onChange={handleRestricaoChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="restricao-vegetariano" className="font-medium text-gray-700">
                      Vegetariano
                    </label>
                    <p className="text-gray-500">Não consumo carne.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="restricao-vegano"
                      type="checkbox"
                      value="vegano"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={restricoes.includes('vegano')}
                      onChange={handleRestricaoChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="restricao-vegano" className="font-medium text-gray-700">
                      Vegano
                    </label>
                    <p className="text-gray-500">Não consumo nenhum produto de origem animal.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="restricao-sem-gluten"
                      type="checkbox"
                      value="sem-gluten"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={restricoes.includes('sem-gluten')}
                      onChange={handleRestricaoChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="restricao-sem-gluten" className="font-medium text-gray-700">
                      Sem Glúten
                    </label>
                    <p className="text-gray-500">Não consumo glúten.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quais são suas preferências alimentares?
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="preferencia-baixo-carboidrato"
                      type="checkbox"
                      value="baixo-carboidrato"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={preferenciasAlimentares.includes('baixo-carboidrato')}
                      onChange={handlePreferenciaChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="preferencia-baixo-carboidrato" className="font-medium text-gray-700">
                      Baixo Carboidrato
                    </label>
                    <p className="text-gray-500">Prefiro alimentos com baixo teor de carboidratos.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="preferencia-rica-proteina"
                      type="checkbox"
                      value="rica-proteina"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={preferenciasAlimentares.includes('rica-proteina')}
                      onChange={handlePreferenciaChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="preferencia-rica-proteina" className="font-medium text-gray-700">
                      Rica em Proteína
                    </label>
                    <p className="text-gray-500">Prefiro alimentos ricos em proteína.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="frequenciaRefeicoes" className="block text-sm font-medium text-gray-700">
                Com que frequência você costuma fazer refeições ao dia?
              </label>
              <div className="mt-1">
                <select
                  id="frequenciaRefeicoes"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={frequenciaRefeicoes}
                  onChange={(e) => setFrequenciaRefeicoes(e.target.value)}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="3">3 vezes ao dia</option>
                  <option value="4">4 vezes ao dia</option>
                  <option value="5+">5 ou mais vezes ao dia</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="nivelAtividade" className="block text-sm font-medium text-gray-700">
                Qual é o seu nível de atividade física?
              </label>
              <div className="mt-1">
                <select
                  id="nivelAtividade"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={nivelAtividade}
                  onChange={(e) => setNivelAtividade(e.target.value)}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="sedentario">Sedentário (pouca ou nenhuma atividade)</option>
                  <option value="levemente-ativo">Levemente Ativo (exercício leve 1-3 dias/semana)</option>
                  <option value="moderadamente-ativo">Moderadamente Ativo (exercício moderado 3-5 dias/semana)</option>
                  <option value="altamente-ativo">Altamente Ativo (exercício intenso 6-7 dias/semana)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Você possui alguma alergia alimentar?
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="alergia-lactose"
                      type="checkbox"
                      value="lactose"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={alergias.includes('lactose')}
                      onChange={handleAlergiaChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="alergia-lactose" className="font-medium text-gray-700">
                      Alergia à Lactose
                    </label>
                    <p className="text-gray-500">Sou alérgico(a) à lactose.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="alergia-gluten"
                      type="checkbox"
                      value="gluten"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={alergias.includes('gluten')}
                      onChange={handleAlergiaChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="alergia-gluten" className="font-medium text-gray-700">
                      Alergia ao Glúten
                    </label>
                    <p className="text-gray-500">Sou alérgico(a) ao glúten.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Você utiliza algum suplemento alimentar?
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="suplemento-whey"
                      type="checkbox"
                      value="whey"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={suplementos.includes('whey')}
                      onChange={handleSuplementoChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="suplemento-whey" className="font-medium text-gray-700">
                      Whey Protein
                    </label>
                    <p className="text-gray-500">Utilizo whey protein regularmente.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="suplemento-creatina"
                      type="checkbox"
                      value="creatina"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={suplementos.includes('creatina')}
                      onChange={handleSuplementoChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="suplemento-creatina" className="font-medium text-gray-700">
                      Creatina
                    </label>
                    <p className="text-gray-500">Utilizo creatina regularmente.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="horarioPreferencia" className="block text-sm font-medium text-gray-700">
                Qual é o seu horário de preferência para as refeições?
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="horarioPreferencia"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={horarioPreferencia}
                  onChange={(e) => setHorarioPreferencia(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="orcamento" className="block text-sm font-medium text-gray-700">
                Qual é o seu orçamento para alimentação?
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="orcamento"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={orcamento}
                  onChange={(e) => setOrcamento(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Questionário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizAlimentar;
