
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { Dumbbell, Clock, Target, PlayCircle } from 'lucide-react';

type TreinoData = Tables<'treino'>;

interface TreinoWeekTableProps {
  treinoData: TreinoData;
}

const TreinoWeekTable = ({ treinoData }: TreinoWeekTableProps) => {
  const diasSemana = [
    { key: 'segunda_feira', nome: 'Segunda-feira', color: 'bg-blue-500' },
    { key: 'terca_feira', nome: 'Terça-feira', color: 'bg-green-500' },
    { key: 'quarta_feira', nome: 'Quarta-feira', color: 'bg-purple-500' },
    { key: 'quinta_feira', nome: 'Quinta-feira', color: 'bg-orange-500' },
    { key: 'sexta_feira', nome: 'Sexta-feira', color: 'bg-pink-500' },
    { key: 'sabado', nome: 'Sábado', color: 'bg-indigo-500' },
    { key: 'domingo', nome: 'Domingo', color: 'bg-red-500' }
  ];

  const formatTreinoData = (treinoRaw: any): any => {
    console.log('TreinoWeekTable: Dados brutos recebidos:', treinoRaw);
    
    if (!treinoRaw) {
      console.log('TreinoWeekTable: Dados vazios ou null');
      return null;
    }
    
    // Se já é um objeto, retorna como está
    if (typeof treinoRaw === 'object' && treinoRaw !== null) {
      console.log('TreinoWeekTable: Dados já são objeto:', treinoRaw);
      return treinoRaw;
    }
    
    // Se é uma string, tenta parsear como JSON
    if (typeof treinoRaw === 'string') {
      try {
        const parsed = JSON.parse(treinoRaw);
        console.log('TreinoWeekTable: JSON parseado com sucesso:', parsed);
        return parsed;
      } catch (error) {
        console.log('TreinoWeekTable: Erro ao parsear JSON, tratando como texto simples:', error);
        return {
          foco: treinoRaw.includes('Foco:') ? treinoRaw.split('Foco:')[1]?.split('\n')[0]?.trim() : null,
          descricao: treinoRaw,
          exercicios: []
        };
      }
    }
    
    return null;
  };

  const renderExercicios = (exercicios: any[]) => {
    if (!Array.isArray(exercicios) || exercicios.length === 0) {
      return (
        <div className="text-center py-4">
          <Dumbbell className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-sm text-gray-500">Nenhum exercício definido</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        {exercicios.slice(0, 4).map((exercicio, index) => (
          <div key={index} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 text-sm">
                  {exercicio.nome || exercicio.exercicio || `Exercício ${index + 1}`}
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {exercicio.series && exercicio.repeticoes && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {exercicio.series}x{exercicio.repeticoes}
                    </span>
                  )}
                  {exercicio.carga && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      {exercicio.carga}
                    </span>
                  )}
                  {exercicio.descanso && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                      {exercicio.descanso}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {exercicios.length > 4 && (
          <div className="text-center py-2">
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
              +{exercicios.length - 4} exercícios adicionais
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderTreinoCard = (dia: any, treinoDia: any) => {
    const hasWorkout = treinoDia && (
      (treinoDia.exercicios && Array.isArray(treinoDia.exercicios) && treinoDia.exercicios.length > 0) ||
      (treinoDia.descricao && treinoDia.descricao.trim().length > 0)
    );

    return (
      <Card key={dia.key} className="h-full hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: dia.color.replace('bg-', '').replace('-500', '') }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${dia.color}`}></div>
              {dia.nome}
            </CardTitle>
            {hasWorkout && (
              <PlayCircle className="text-green-500" size={20} />
            )}
          </div>
          
          {/* Foco do Treino */}
          {treinoDia?.foco && (
            <div className="flex items-center gap-2 mt-2">
              <Target className="text-blue-500" size={16} />
              <span className="text-sm font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">
                {treinoDia.foco}
              </span>
            </div>
          )}

          {/* Duração */}
          {treinoDia?.duracao && (
            <div className="flex items-center gap-2 mt-1">
              <Clock className="text-orange-500" size={16} />
              <span className="text-sm text-gray-600">{treinoDia.duracao}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {hasWorkout ? (
            <>
              {/* Exercícios */}
              {treinoDia.exercicios && Array.isArray(treinoDia.exercicios) && treinoDia.exercicios.length > 0 ? (
                renderExercicios(treinoDia.exercicios)
              ) : treinoDia.descricao ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {treinoDia.descricao.length > 150 
                      ? `${treinoDia.descricao.substring(0, 150)}...`
                      : treinoDia.descricao
                    }
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 font-medium">
                    Treino personalizado disponível
                  </p>
                </div>
              )}

              {/* Observações */}
              {treinoDia.observacoes && (
                <div className="mt-3 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-xs text-yellow-800">
                    <span className="font-medium">Obs:</span> {treinoDia.observacoes}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Dumbbell className="text-gray-300 mx-auto mb-3" size={32} />
              <p className="text-gray-500 text-sm font-medium">Descanso</p>
              <p className="text-gray-400 text-xs mt-1">Sem treino programado</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  console.log('TreinoWeekTable: Dados completos do treino:', treinoData);

  return (
    <div className="w-full space-y-6">
      {/* Header do Plano */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Dumbbell className="text-white" size={24} />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                {treinoData.nome_plano || 'Cronograma Semanal de Treinos'}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Criado em: {new Date(treinoData.webhook_received_at || treinoData.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </CardHeader>
        
        {treinoData.descricao && (
          <CardContent className="pt-0">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Target size={16} />
                Observações do Plano:
              </h4>
              <p className="text-sm text-blue-700 leading-relaxed">{treinoData.descricao}</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Grid de Treinos da Semana */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {diasSemana.map((dia) => {
          const treinoDiaRaw = treinoData[dia.key as keyof TreinoData];
          console.log(`TreinoWeekTable: ${dia.nome} - dados brutos:`, treinoDiaRaw);
          
          const treinoDia = formatTreinoData(treinoDiaRaw);
          console.log(`TreinoWeekTable: ${dia.nome} - dados formatados:`, treinoDia);
          
          return renderTreinoCard(dia, treinoDia);
        })}
      </div>

      {/* Estatísticas do Plano */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {diasSemana.filter(dia => {
                  const treinoDia = formatTreinoData(treinoData[dia.key as keyof TreinoData]);
                  return treinoDia && ((treinoDia.exercicios && treinoDia.exercicios.length > 0) || treinoDia.descricao);
                }).length}
              </div>
              <div className="text-sm text-gray-600">Dias de Treino</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {diasSemana.reduce((total, dia) => {
                  const treinoDia = formatTreinoData(treinoData[dia.key as keyof TreinoData]);
                  return total + (treinoDia?.exercicios?.length || 0);
                }, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Exercícios</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {7 - diasSemana.filter(dia => {
                  const treinoDia = formatTreinoData(treinoData[dia.key as keyof TreinoData]);
                  return treinoDia && ((treinoDia.exercicios && treinoDia.exercicios.length > 0) || treinoDia.descricao);
                }).length}
              </div>
              <div className="text-sm text-gray-600">Dias de Descanso</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">Personalizado</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreinoWeekTable;
