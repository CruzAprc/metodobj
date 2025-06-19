import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { Dumbbell, Clock, Target, PlayCircle, Calendar, Users, Trophy, Zap } from 'lucide-react';

type TreinoData = Tables<'treino'>;

interface TreinoWeekTableProps {
  treinoData: TreinoData;
}

const TreinoWeekTable = ({ treinoData }: TreinoWeekTableProps) => {
  console.log('TreinoWeekTable: Dados recebidos:', treinoData);

  const diasSemana = [
    { key: 'segunda_feira', nome: 'Segunda-feira', color: 'from-blue-500 to-blue-600', icon: '🏋️‍♂️' },
    { key: 'terca_feira', nome: 'Terça-feira', color: 'from-green-500 to-green-600', icon: '💪' },
    { key: 'quarta_feira', nome: 'Quarta-feira', color: 'from-purple-500 to-purple-600', icon: '🔥' },
    { key: 'quinta_feira', nome: 'Quinta-feira', color: 'from-orange-500 to-orange-600', icon: '⚡' },
    { key: 'sexta_feira', nome: 'Sexta-feira', color: 'from-pink-500 to-pink-600', icon: '🎯' },
    { key: 'sabado', nome: 'Sábado', color: 'from-indigo-500 to-indigo-600', icon: '🚀' },
    { key: 'domingo', nome: 'Domingo', color: 'from-red-500 to-red-600', icon: '🏃‍♂️' }
  ];

  const parseWorkoutText = (text: string) => {
    console.log('TreinoWeekTable: Parseando texto do treino:', text);
    
    if (!text || typeof text !== 'string') {
      return { foco: '', tempo: '', exercicios: [], observacoes: '' };
    }

    const lines = text.split('\n').filter(line => line.trim());
    const result = { foco: '', tempo: '', exercicios: [], observacoes: '' };
    
    // Extrair foco
    const focoMatch = text.match(/Foco:\s*(.+?)(?:\n|Tempo:|$)/i);
    if (focoMatch) {
      result.foco = focoMatch[1].trim();
    }
    
    // Extrair tempo
    const tempoMatch = text.match(/Tempo:\s*(.+?)(?:\n|\d+\.|$)/i);
    if (tempoMatch) {
      result.tempo = tempoMatch[1].trim();
    }
    
    // Extrair exercícios (numerados)
    const exercicioRegex = /(\d+)\.\s*(.+?)\s*-\s*(\d+x\d+)\s*-\s*Descanso\s*(\d+s)/g;
    let match;
    
    while ((match = exercicioRegex.exec(text)) !== null) {
      const [, numero, nome, series, descanso] = match;
      result.exercicios.push({
        numero: parseInt(numero),
        nome: nome.trim(),
        series: series.trim(),
        descanso: descanso.trim()
      });
    }
    
    // Extrair observações/cardio
    const cardioMatch = text.match(/Cardio Extra[^:]*:([\s\S]*?)(?:\n\n|$)/i);
    if (cardioMatch) {
      result.observacoes = cardioMatch[1].trim();
    }
    
    console.log('TreinoWeekTable: Resultado do parse:', result);
    return result;
  };

  const formatTreinoData = (treinoRaw: any): any => {
    console.log('TreinoWeekTable: Formatando dados do treino:', treinoRaw);
    
    if (!treinoRaw) {
      console.log('TreinoWeekTable: Dados do treino são null/undefined');
      return null;
    }
    
    // Se já é um objeto, retorna como está
    if (typeof treinoRaw === 'object' && treinoRaw !== null) {
      console.log('TreinoWeekTable: Dados já são um objeto:', treinoRaw);
      return treinoRaw;
    }
    
    // Se é uma string, tenta parsear o texto estruturado
    if (typeof treinoRaw === 'string') {
      const parsed = parseWorkoutText(treinoRaw);
      console.log('TreinoWeekTable: Texto parseado com sucesso:', parsed);
      return parsed;
    }
    
    return null;
  };

  const renderExercicios = (exercicios: any[]) => {
    console.log('TreinoWeekTable: Renderizando exercícios:', exercicios);
    
    if (!Array.isArray(exercicios) || exercicios.length === 0) {
      return (
        <div className="text-center py-4">
          <Dumbbell className="mx-auto text-gray-300 mb-2" size={24} />
          <p className="text-sm text-gray-500">Nenhum exercício definido</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        {exercicios.map((exercicio, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-gray-100/50 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {exercicio.numero || index + 1}
                  </span>
                  <h5 className="font-bold text-gray-800 text-base">
                    {exercicio.nome || exercicio.exercicio || `Exercício ${index + 1}`}
                  </h5>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-3">
                  {(exercicio.series || exercicio.repeticoes) && (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-2 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Target className="text-blue-600" size={14} />
                        <div>
                          <p className="text-xs text-blue-600 font-medium">REPETIÇÕES</p>
                          <p className="text-sm font-bold text-blue-800">
                            {exercicio.series || `${exercicio.series}x${exercicio.repeticoes}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {exercicio.descanso && (
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-3 py-2 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2">
                        <Clock className="text-orange-600" size={14} />
                        <div>
                          <p className="text-xs text-orange-600 font-medium">DESCANSO</p>
                          <p className="text-sm font-bold text-orange-800">{exercicio.descanso}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {exercicio.carga && (
                    <div className="bg-gradient-to-r from-green-50 to-green-100 px-3 py-2 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="text-green-600" size={14} />
                        <div>
                          <p className="text-xs text-green-600 font-medium">CARGA</p>
                          <p className="text-sm font-bold text-green-800">{exercicio.carga}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {exercicio.observacoes && (
                  <div className="mt-3 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">Obs:</span> {exercicio.observacoes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTreinoCard = (dia: any, treinoDia: any) => {
    console.log(`TreinoWeekTable: Renderizando card para ${dia.nome}:`, treinoDia);
    
    const hasWorkout = treinoDia && (
      (treinoDia.exercicios && Array.isArray(treinoDia.exercicios) && treinoDia.exercicios.length > 0) ||
      (treinoDia.foco && treinoDia.foco.trim().length > 0) ||
      (treinoDia.tempo && treinoDia.tempo.trim().length > 0)
    );

    console.log(`TreinoWeekTable: ${dia.nome} tem treino:`, hasWorkout);

    return (
      <Card key={dia.key} className="h-full hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${dia.color}`}></div>
        
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-3">
              <span className="text-2xl">{dia.icon}</span>
              <div>
                <div>{dia.nome}</div>
                {hasWorkout && (
                  <div className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                    <PlayCircle size={12} />
                    Treino programado
                  </div>
                )}
              </div>
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-4 pb-4">
          {hasWorkout ? (
            <>
              {/* Foco como Subheadline */}
              {treinoDia?.foco && (
                <div className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="text-blue-600" size={18} />
                    <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">FOCO DO TREINO</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 leading-tight">{treinoDia.foco}</h3>
                </div>
              )}

              {/* Tempo como Título */}
              {treinoDia?.tempo && (
                <div className="mb-4 bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-orange-600" size={18} />
                    <span className="text-sm font-bold text-orange-700 uppercase tracking-wide">DURAÇÃO</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{treinoDia.tempo}</h3>
                </div>
              )}

              {/* Lista de Exercícios */}
              {treinoDia.exercicios && Array.isArray(treinoDia.exercicios) && treinoDia.exercicios.length > 0 ? (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Dumbbell className="text-gray-700" size={18} />
                    <h4 className="text-lg font-bold text-gray-800">
                      Exercícios ({treinoDia.exercicios.length})
                    </h4>
                  </div>
                  {renderExercicios(treinoDia.exercicios)}
                </div>
              ) : (
                <div className="mb-4 bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <PlayCircle className="text-blue-600" size={16} />
                    <span className="text-sm font-semibold text-blue-700">Treino Disponível</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Seu treino personalizado está pronto para este dia
                  </p>
                </div>
              )}

              {/* Observações Gerais/Cardio */}
              {treinoDia.observacoes && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-l-4 border-yellow-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="text-yellow-600" size={16} />
                    <span className="text-sm font-bold text-yellow-700 uppercase tracking-wide">CARDIO EXTRA</span>
                  </div>
                  <div className="text-sm text-yellow-800 leading-relaxed whitespace-pre-line">
                    {treinoDia.observacoes}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <div className="text-4xl mb-3">😴</div>
              <h4 className="text-lg font-bold text-gray-600 mb-1">Dia de Descanso</h4>
              <p className="text-gray-500 text-sm">Recuperação é fundamental</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Calcular estatísticas
  const diasComTreino = diasSemana.filter(dia => {
    const treinoDia = formatTreinoData(treinoData[dia.key as keyof TreinoData]);
    return treinoDia && ((treinoDia.exercicios && treinoDia.exercicios.length > 0) || treinoDia.foco || treinoDia.tempo);
  }).length;

  const totalExercicios = diasSemana.reduce((total, dia) => {
    const treinoDia = formatTreinoData(treinoData[dia.key as keyof TreinoData]);
    return total + (treinoDia?.exercicios?.length || 0);
  }, 0);

  const diasDescanso = 7 - diasComTreino;

  console.log('TreinoWeekTable: Estatísticas calculadas:', { diasComTreino, totalExercicios, diasDescanso });

  return (
    <div className="w-full space-y-6">
      {/* Header do Plano */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Dumbbell className="text-white" size={28} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold mb-2">
                {treinoData.nome_plano || 'Seu Plano de Treino Personalizado'}
              </CardTitle>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span className="text-sm">
                    Criado em: {new Date(treinoData.webhook_received_at || treinoData.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        {treinoData.descricao && (
          <CardContent className="relative z-10 pt-0">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Target size={16} />
                Descrição do Plano:
              </h4>
              <p className="text-white/90 leading-relaxed">{treinoData.descricao}</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Estatísticas do Plano */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold mb-1">{diasComTreino}</div>
            <div className="text-xs opacity-90 flex items-center justify-center gap-1">
              <Calendar size={12} />
              Dias de Treino
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold mb-1">{totalExercicios}</div>
            <div className="text-xs opacity-90 flex items-center justify-center gap-1">
              <Dumbbell size={12} />
              Total Exercícios
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold mb-1">{diasDescanso}</div>
            <div className="text-xs opacity-90 flex items-center justify-center gap-1">
              <Users size={12} />
              Dias Descanso
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold mb-1">100%</div>
            <div className="text-xs opacity-90 flex items-center justify-center gap-1">
              <Trophy size={12} />
              Personalizado
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid de Treinos da Semana */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <Calendar className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Cronograma Semanal</h2>
            <p className="text-gray-600 text-sm">Seus treinos organizados por dia da semana</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {diasSemana.map((dia) => {
            const treinoDiaRaw = treinoData[dia.key as keyof TreinoData];
            const treinoDia = formatTreinoData(treinoDiaRaw);
            
            console.log(`TreinoWeekTable: Dados para ${dia.nome}:`, { raw: treinoDiaRaw, formatted: treinoDia });
            
            return renderTreinoCard(dia, treinoDia);
          })}
        </div>
      </div>

      {/* Rodapé com informações */}
      <Card className="border-0 bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Trophy size={18} />
            <span className="text-base font-semibold">Plano criado especialmente para você pelo Basa</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Treino personalizado baseado no seu perfil e objetivos • ID: {treinoData.universal_id}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreinoWeekTable;
