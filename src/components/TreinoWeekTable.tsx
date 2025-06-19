
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { Dumbbell, Clock, Target, PlayCircle, Calendar, Users, Trophy, Zap } from 'lucide-react';

type TreinoData = Tables<'treino'>;

interface TreinoWeekTableProps {
  treinoData: TreinoData;
}

const TreinoWeekTable = ({ treinoData }: TreinoWeekTableProps) => {
  const diasSemana = [
    { key: 'segunda_feira', nome: 'Segunda-feira', color: 'from-blue-500 to-blue-600', icon: '🏋️‍♂️' },
    { key: 'terca_feira', nome: 'Terça-feira', color: 'from-green-500 to-green-600', icon: '💪' },
    { key: 'quarta_feira', nome: 'Quarta-feira', color: 'from-purple-500 to-purple-600', icon: '🔥' },
    { key: 'quinta_feira', nome: 'Quinta-feira', color: 'from-orange-500 to-orange-600', icon: '⚡' },
    { key: 'sexta_feira', nome: 'Sexta-feira', color: 'from-pink-500 to-pink-600', icon: '🎯' },
    { key: 'sabado', nome: 'Sábado', color: 'from-indigo-500 to-indigo-600', icon: '🚀' },
    { key: 'domingo', nome: 'Domingo', color: 'from-red-500 to-red-600', icon: '🏃‍♂️' }
  ];

  const formatTreinoData = (treinoRaw: any): any => {
    console.log('TreinoWeekTable: Processando dados:', treinoRaw);
    
    if (!treinoRaw) {
      return null;
    }
    
    // Se já é um objeto, retorna como está
    if (typeof treinoRaw === 'object' && treinoRaw !== null) {
      return treinoRaw;
    }
    
    // Se é uma string, tenta parsear como JSON
    if (typeof treinoRaw === 'string') {
      try {
        const parsed = JSON.parse(treinoRaw);
        return parsed;
      } catch (error) {
        console.log('Erro ao parsear JSON:', error);
        return {
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
        <div className="text-center py-6">
          <Dumbbell className="mx-auto text-gray-300 mb-2" size={32} />
          <p className="text-sm text-gray-500 font-medium">Nenhum exercício definido</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        {exercicios.map((exercicio, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-base mb-2">
                  {exercicio.nome || exercicio.exercicio || `Exercício ${index + 1}`}
                </h4>
                
                <div className="flex flex-wrap gap-2">
                  {exercicio.series && exercicio.repeticoes && (
                    <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Target size={12} />
                      {exercicio.series}x{exercicio.repeticoes}
                    </span>
                  )}
                  
                  {exercicio.carga && (
                    <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Dumbbell size={12} />
                      {exercicio.carga}
                    </span>
                  )}
                  
                  {exercicio.descanso && (
                    <span className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Clock size={12} />
                      {exercicio.descanso}
                    </span>
                  )}
                </div>
                
                {exercicio.observacoes && (
                  <div className="mt-3 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-xs text-yellow-800">
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
    const hasWorkout = treinoDia && (
      (treinoDia.exercicios && Array.isArray(treinoDia.exercicios) && treinoDia.exercicios.length > 0) ||
      (treinoDia.descricao && treinoDia.descricao.trim().length > 0)
    );

    return (
      <Card key={dia.key} className="h-full hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
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
          
          {/* Foco do Treino */}
          {treinoDia?.foco && (
            <div className="flex items-center gap-2 mt-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Target className="text-blue-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">FOCO DO TREINO</p>
                <p className="text-sm font-semibold text-blue-700">{treinoDia.foco}</p>
              </div>
            </div>
          )}

          {/* Duração */}
          {treinoDia?.duracao && (
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Clock className="text-orange-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">DURAÇÃO</p>
                <p className="text-sm font-semibold text-orange-700">{treinoDia.duracao}</p>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {hasWorkout ? (
            <>
              {/* Exercícios */}
              {treinoDia.exercicios && Array.isArray(treinoDia.exercicios) && treinoDia.exercicios.length > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Dumbbell className="text-gray-600" size={16} />
                    <span className="text-sm font-semibold text-gray-700">
                      {treinoDia.exercicios.length} Exercício{treinoDia.exercicios.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  {renderExercicios(treinoDia.exercicios)}
                </div>
              ) : treinoDia.descricao ? (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <PlayCircle className="text-blue-600" size={16} />
                    <span className="text-sm font-semibold text-blue-700">Treino Personalizado</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {treinoDia.descricao}
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="text-green-600" size={16} />
                    <span className="text-sm font-semibold text-green-700">Treino Disponível</span>
                  </div>
                  <p className="text-xs text-green-600">
                    Seu treino personalizado está pronto para ser executado
                  </p>
                </div>
              )}

              {/* Observações Gerais */}
              {treinoDia.observacoes && (
                <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-l-4 border-yellow-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="text-yellow-600" size={14} />
                    <span className="text-xs font-semibold text-yellow-700">OBSERVAÇÕES IMPORTANTES</span>
                  </div>
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    {treinoDia.observacoes}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <div className="text-4xl mb-3">😴</div>
              <p className="text-gray-600 font-semibold text-base">Dia de Descanso</p>
              <p className="text-gray-400 text-sm mt-1">Recuperação é fundamental</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Calcular estatísticas
  const diasComTreino = diasSemana.filter(dia => {
    const treinoDia = formatTreinoData(treinoData[dia.key as keyof TreinoData]);
    return treinoDia && ((treinoDia.exercicios && treinoDia.exercicios.length > 0) || treinoDia.descricao);
  }).length;

  const totalExercicios = diasSemana.reduce((total, dia) => {
    const treinoDia = formatTreinoData(treinoData[dia.key as keyof TreinoData]);
    return total + (treinoDia?.exercicios?.length || 0);
  }, 0);

  const diasDescanso = 7 - diasComTreino;

  console.log('TreinoWeekTable: Dados completos do treino:', treinoData);

  return (
    <div className="w-full space-y-8">
      {/* Header do Plano */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Dumbbell className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold mb-2">
                {treinoData.nome_plano || 'Seu Plano de Treino Personalizado'}
              </CardTitle>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
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
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-1">{diasComTreino}</div>
            <div className="text-sm opacity-90 flex items-center justify-center gap-1">
              <Calendar size={14} />
              Dias de Treino
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-1">{totalExercicios}</div>
            <div className="text-sm opacity-90 flex items-center justify-center gap-1">
              <Dumbbell size={14} />
              Total Exercícios
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-1">{diasDescanso}</div>
            <div className="text-sm opacity-90 flex items-center justify-center gap-1">
              <Users size={14} />
              Dias Descanso
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-1">100%</div>
            <div className="text-sm opacity-90 flex items-center justify-center gap-1">
              <Trophy size={14} />
              Personalizado
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid de Treinos da Semana */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
            <Calendar className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Cronograma Semanal</h2>
            <p className="text-gray-600">Seus treinos organizados por dia da semana</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {diasSemana.map((dia) => {
            const treinoDiaRaw = treinoData[dia.key as keyof TreinoData];
            const treinoDia = formatTreinoData(treinoDiaRaw);
            
            return renderTreinoCard(dia, treinoDia);
          })}
        </div>
      </div>

      {/* Rodapé com informações */}
      <Card className="border-0 bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Trophy size={20} />
            <span className="text-lg font-semibold">Plano criado especialmente para você pelo Basa</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Treino personalizado baseado no seu perfil e objetivos • Universal ID: {treinoData.universal_id}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreinoWeekTable;
