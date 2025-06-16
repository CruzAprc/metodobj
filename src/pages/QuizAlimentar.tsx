
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const handleRestricaoChange = (value: string, checked: boolean) => {
    setRestricoes(prev => checked ? [...prev, value] : prev.filter(item => item !== value));
  };

  const handlePreferenciaChange = (value: string, checked: boolean) => {
    setPreferenciasAlimentares(prev => checked ? [...prev, value] : prev.filter(item => item !== value));
  };

  const handleAlergiaChange = (value: string, checked: boolean) => {
    setAlergias(prev => checked ? [...prev, value] : prev.filter(item => item !== value));
  };

  const handleSuplementoChange = (value: string, checked: boolean) => {
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
      }

      console.log('Quiz salvo com sucesso!');
      
      // Registrar evento de conclusão
      await supabase.rpc('log_user_event', {
        p_user_id: user.id,
        p_event_type: 'quiz_alimentar_completed',
        p_event_data: quizData
      });

      // Redirecionar para loading-treino
      navigate('/loading-treino');
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-6 px-4 sm:px-6 lg:px-8">
      <Header 
        showBack={true} 
        onBack={() => navigate('/loading')}
        title="Questionário Alimentar"
      />
      
      <div className="max-w-4xl mx-auto space-y-6 mt-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent mb-2">
            Questionário Alimentar
          </h1>
          <p className="text-gray-600">
            Nos conte sobre seus hábitos alimentares para criarmos sua dieta personalizada
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Objetivo */}
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                🎯 Qual é o seu principal objetivo?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                placeholder="Ex: Perder peso, ganhar massa muscular, manter o peso..."
                className="fitness-input"
                required
              />
            </CardContent>
          </Card>

          {/* Restrições Alimentares */}
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                🚫 Restrições Alimentares
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { value: 'vegetariano', label: 'Vegetariano', desc: 'Não consumo carne' },
                { value: 'vegano', label: 'Vegano', desc: 'Não consumo produtos de origem animal' },
                { value: 'sem-gluten', label: 'Sem Glúten', desc: 'Não consumo glúten' }
              ].map((item) => (
                <div key={item.value} className="flex items-start space-x-3 p-3 rounded-lg bg-pink-50/50">
                  <Checkbox
                    id={`restricao-${item.value}`}
                    checked={restricoes.includes(item.value)}
                    onCheckedChange={(checked) => handleRestricaoChange(item.value, checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor={`restricao-${item.value}`} className="font-medium text-gray-800">
                      {item.label}
                    </Label>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Preferências Alimentares */}
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                ❤️ Preferências Alimentares
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { value: 'baixo-carboidrato', label: 'Baixo Carboidrato', desc: 'Prefiro alimentos com baixo teor de carboidratos' },
                { value: 'rica-proteina', label: 'Rica em Proteína', desc: 'Prefiro alimentos ricos em proteína' }
              ].map((item) => (
                <div key={item.value} className="flex items-start space-x-3 p-3 rounded-lg bg-pink-50/50">
                  <Checkbox
                    id={`preferencia-${item.value}`}
                    checked={preferenciasAlimentares.includes(item.value)}
                    onCheckedChange={(checked) => handlePreferenciaChange(item.value, checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor={`preferencia-${item.value}`} className="font-medium text-gray-800">
                      {item.label}
                    </Label>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Frequência de Refeições */}
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                🍽️ Frequência de Refeições
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={frequenciaRefeicoes} onValueChange={setFrequenciaRefeicoes} required>
                <SelectTrigger className="fitness-input">
                  <SelectValue placeholder="Selecione quantas refeições por dia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 vezes ao dia</SelectItem>
                  <SelectItem value="4">4 vezes ao dia</SelectItem>
                  <SelectItem value="5+">5 ou mais vezes ao dia</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Nível de Atividade */}
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                💪 Nível de Atividade Física
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={nivelAtividade} onValueChange={setNivelAtividade} required>
                <SelectTrigger className="fitness-input">
                  <SelectValue placeholder="Selecione seu nível de atividade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentario">Sedentário (pouca ou nenhuma atividade)</SelectItem>
                  <SelectItem value="levemente-ativo">Levemente Ativo (exercício leve 1-3 dias/semana)</SelectItem>
                  <SelectItem value="moderadamente-ativo">Moderadamente Ativo (exercício moderado 3-5 dias/semana)</SelectItem>
                  <SelectItem value="altamente-ativo">Altamente Ativo (exercício intenso 6-7 dias/semana)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Alergias */}
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                ⚠️ Alergias Alimentares
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { value: 'lactose', label: 'Lactose', desc: 'Sou alérgico(a) à lactose' },
                { value: 'gluten', label: 'Glúten', desc: 'Sou alérgico(a) ao glúten' }
              ].map((item) => (
                <div key={item.value} className="flex items-start space-x-3 p-3 rounded-lg bg-pink-50/50">
                  <Checkbox
                    id={`alergia-${item.value}`}
                    checked={alergias.includes(item.value)}
                    onCheckedChange={(checked) => handleAlergiaChange(item.value, checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor={`alergia-${item.value}`} className="font-medium text-gray-800">
                      {item.label}
                    </Label>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Suplementos */}
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                💊 Suplementos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { value: 'whey', label: 'Whey Protein', desc: 'Utilizo whey protein regularmente' },
                { value: 'creatina', label: 'Creatina', desc: 'Utilizo creatina regularmente' }
              ].map((item) => (
                <div key={item.value} className="flex items-start space-x-3 p-3 rounded-lg bg-pink-50/50">
                  <Checkbox
                    id={`suplemento-${item.value}`}
                    checked={suplementos.includes(item.value)}
                    onCheckedChange={(checked) => handleSuplementoChange(item.value, checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor={`suplemento-${item.value}`} className="font-medium text-gray-800">
                      {item.label}
                    </Label>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Horário de Preferência */}
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                🕐 Horário de Preferência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={horarioPreferencia}
                onChange={(e) => setHorarioPreferencia(e.target.value)}
                placeholder="Ex: Café da manhã às 7h, almoço às 12h..."
                className="fitness-input"
                required
              />
            </CardContent>
          </Card>

          {/* Orçamento */}
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                💰 Orçamento para Alimentação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={orcamento}
                onChange={(e) => setOrcamento(e.target.value)}
                placeholder="Ex: R$ 500 por mês"
                className="fitness-input"
                required
              />
            </CardContent>
          </Card>

          {/* Botão de Envio */}
          <div className="pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full fitness-button text-lg py-6"
            >
              {isSubmitting ? 'Processando...' : 'Finalizar Questionário 🚀'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizAlimentar;
