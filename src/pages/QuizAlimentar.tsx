
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

    if (!objetivo || !frequenciaRefeicoes || !nivelAtividade || !horarioPreferencia || !orcamento) {
      console.error('Todos os campos obrigatórios devem ser preenchidos');
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
              <RadioGroup value={objetivo} onValueChange={setObjetivo} className="space-y-3">
                {[
                  'Perder peso',
                  'Ganhar massa muscular',
                  'Manter o peso atual',
                  'Melhorar a saúde geral',
                  'Aumentar energia e disposição'
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`objetivo-${option}`} />
                    <Label htmlFor={`objetivo-${option}`} className="font-medium">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
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
                { value: 'sem-gluten', label: 'Sem Glúten', desc: 'Não consumo glúten' },
                { value: 'sem-lactose', label: 'Sem Lactose', desc: 'Não consumo lactose' },
                { value: 'low-carb', label: 'Low Carb', desc: 'Prefiro baixo carboidrato' },
                { value: 'nenhuma', label: 'Nenhuma restrição', desc: 'Posso comer de tudo' }
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
                { value: 'rica-proteina', label: 'Rica em Proteína', desc: 'Prefiro alimentos ricos em proteína' },
                { value: 'muitas-fibras', label: 'Rica em Fibras', desc: 'Gosto de alimentos com muitas fibras' },
                { value: 'comida-caseira', label: 'Comida Caseira', desc: 'Prefiro preparar minhas refeições' },
                { value: 'praticidade', label: 'Praticidade', desc: 'Prefiro opções rápidas e práticas' },
                { value: 'organicos', label: 'Alimentos Orgânicos', desc: 'Prefiro alimentos orgânicos' }
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
                🍽️ Quantas refeições você faz por dia?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={frequenciaRefeicoes} onValueChange={setFrequenciaRefeicoes} className="space-y-3">
                {[
                  { value: '3', label: '3 refeições por dia' },
                  { value: '4', label: '4 refeições por dia' },
                  { value: '5', label: '5 refeições por dia' },
                  { value: '6+', label: '6 ou mais refeições por dia' }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`freq-${option.value}`} />
                    <Label htmlFor={`freq-${option.value}`} className="font-medium">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Nível de Atividade */}
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                💪 Qual seu nível de atividade física?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={nivelAtividade} onValueChange={setNivelAtividade} className="space-y-3">
                {[
                  { value: 'sedentario', label: 'Sedentário', desc: 'Pouca ou nenhuma atividade física' },
                  { value: 'levemente-ativo', label: 'Levemente Ativo', desc: 'Exercício leve 1-3 dias/semana' },
                  { value: 'moderadamente-ativo', label: 'Moderadamente Ativo', desc: 'Exercício moderado 3-5 dias/semana' },
                  { value: 'altamente-ativo', label: 'Altamente Ativo', desc: 'Exercício intenso 6-7 dias/semana' }
                ].map((option) => (
                  <div key={option.value} className="flex items-start space-x-2 p-3 rounded-lg bg-pink-50/50">
                    <RadioGroupItem value={option.value} id={`atividade-${option.value}`} className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor={`atividade-${option.value}`} className="font-medium text-gray-800">
                        {option.label}
                      </Label>
                      <p className="text-sm text-gray-600">{option.desc}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Alergias */}
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                ⚠️ Você tem alguma alergia alimentar?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { value: 'lactose', label: 'Lactose', desc: 'Sou alérgico(a) à lactose' },
                { value: 'gluten', label: 'Glúten', desc: 'Sou alérgico(a) ao glúten' },
                { value: 'oleaginosas', label: 'Oleaginosas', desc: 'Alergia a castanhas, amendoim, etc.' },
                { value: 'frutos-mar', label: 'Frutos do Mar', desc: 'Alergia a camarão, caranguejo, etc.' },
                { value: 'ovos', label: 'Ovos', desc: 'Sou alérgico(a) a ovos' },
                { value: 'nenhuma', label: 'Não tenho alergias', desc: 'Não possuo alergias alimentares' }
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
                💊 Você usa algum suplemento?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { value: 'whey', label: 'Whey Protein', desc: 'Utilizo whey protein regularmente' },
                { value: 'creatina', label: 'Creatina', desc: 'Utilizo creatina regularmente' },
                { value: 'vitaminas', label: 'Vitaminas', desc: 'Tomo complexos vitamínicos' },
                { value: 'omega3', label: 'Ômega 3', desc: 'Suplemento com ômega 3' },
                { value: 'bcaa', label: 'BCAA', desc: 'Utilizo aminoácidos essenciais' },
                { value: 'nenhum', label: 'Não uso suplementos', desc: 'Não utilizo nenhum suplemento' }
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
                🕐 Em qual período você prefere fazer suas principais refeições?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={horarioPreferencia} onValueChange={setHorarioPreferencia} className="space-y-3">
                {[
                  { value: 'manha-cedo', label: 'Manhã cedo (6h-9h)' },
                  { value: 'manha-tarde', label: 'Meio da manhã (9h-12h)' },
                  { value: 'almoco-tradicional', label: 'Almoço tradicional (12h-14h)' },
                  { value: 'tarde', label: 'Tarde (14h-18h)' },
                  { value: 'noite', label: 'Noite (18h-21h)' },
                  { value: 'flexivel', label: 'Horários flexíveis' }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`horario-${option.value}`} />
                    <Label htmlFor={`horario-${option.value}`} className="font-medium">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Orçamento */}
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                💰 Qual seu orçamento mensal para alimentação?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={orcamento} onValueChange={setOrcamento} className="space-y-3">
                {[
                  { value: 'ate-300', label: 'Até R$ 300' },
                  { value: '300-500', label: 'R$ 300 - R$ 500' },
                  { value: '500-800', label: 'R$ 500 - R$ 800' },
                  { value: '800-1200', label: 'R$ 800 - R$ 1.200' },
                  { value: 'acima-1200', label: 'Acima de R$ 1.200' },
                  { value: 'sem-limite', label: 'Sem limite específico' }
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`orcamento-${option.value}`} />
                    <Label htmlFor={`orcamento-${option.value}`} className="font-medium">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
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
