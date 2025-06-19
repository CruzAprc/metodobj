
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
    
    // Se é uma string, tenta parsear como JSON
    if (typeof treinoRaw === 'string') {
      try {
        const parsed = JSON.parse(treinoRaw);
        console.log('TreinoWeekTable: JSON parseado com sucesso:', parsed);
        return parsed;
      } catch (error) {
        console.log('TreinoWeekTable: Erro ao parsear JSON:', error);
        return {
          descricao: treinoRaw,
          exercicios: []
        };
      }
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
          <div key={index} className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-100/50 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h5 className="font-semibold text-gray-800 text-sm mb-2">
                  {exercicio.nome || exercicio.exercicio || `Exercício ${index + 1}`}
                </h5>
                
                <div className="flex flex-wrap gap-2">
                  {exercicio.series && exercicio.repeticoes && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Target size={10} />
                      {exercicio.series}x{exercicio.repeticoes}
                    </span>
                  )}
                  
                  {exercicio.carga && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Dumbbell size={10} />
                      {exercicio.carga}
                    </span>
                  )}
                  
                  {exercicio.descanso && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Clock size={10} />
                      {exercicio.descanso}
                    </span>
                  )}
                </div>
                
                {exercicio.observacoes && (
                  <div className="mt-2 bg-yellow-50 p-2 rounded border-l-2 border-yellow-400">
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
    console.log(`TreinoWeekTable: Renderizando card para ${dia.nome}:`, treinoDia);
    
    const hasWorkout = treinoDia && (
      (treinoDia.exercicios && Array.isArray(treinoDia.exercicios) && treinoDia.exercicios.length > 0) ||
      (treinoDia.descricao && treinoDia.descricao.trim().length > 0)
    );

    console.log(`TreinoWeekTable: ${dia.nome} tem treino:`, hasWorkout);

    return (
      <Card key={dia.key} className="h-full hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${dia.color}`}></div>
        
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
              <span className="text-xl">{dia.icon}</span>
              <div>
                <div>{dia.nome}</div>
                {hasWorkout && (
                  <div className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                    <PlayCircle size={10} />
                    Treino programado
                  </div>
                )}
              </div>
            </CardTitle>
          </div>
          
          {/* Foco do Treino */}
          {treinoDia?.foco && (
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-blue-100 p-1.5 rounded-lg">
                <Target className="text-blue-600" size={12} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">FOCO</p>
                <p className="text-sm font-semibold text-blue-700">{treinoDia.foco}</p>
              </div>
            </div>
          )}

          {/* Duração */}
          {treinoDia?.duracao && (
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-orange-100 p-1.5 rounded-lg">
                <Clock className="text-orange-600" size={12} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">DURAÇÃO</p>
                <p className="text-sm font-semibold text-orange-700">{treinoDia.duracao}</p>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0 px-4 pb-4">
          {hasWorkout ? (
            <>
              {/* Exercícios */}
              {treinoDia.exercicios && Array.isArray(treinoDia.exercicios) && treinoDia.exercicios.length > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Dumbbell className="text-gray-600" size={14} />
                    <span className="text-sm font-semibold text-gray-700">
                      {treinoDia.exercicios.length} Exercício{treinoDia.exercicios.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  {renderExercicios(treinoDia.exercicios)}
                </div>
              ) : treinoDia.descricao ? (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <PlayCircle className="text-blue-600" size={14} />
                    <span className="text-sm font-semibold text-blue-700">Treino Personalizado</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {treinoDia.descricao}
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-3 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="text-green-600" size={14} />
                    <span className="text-sm font-semibold text-green-700">Treino Disponível</span>
                  </div>
                  <p className="text-xs text-green-600">
                    Seu treino personalizado está pronto
                  </p>
                </div>
              )}

              {/* Observações Gerais */}
              {treinoDia.observacoes && (
                <div className="mt-3 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="text-yellow-600" size={12} />
                    <span className="text-xs font-semibold text-yellow-700">OBSERVAÇÕES</span>
                  </div>
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    {treinoDia.observacoes}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
              <div className="text-3xl mb-2">😴</div>
              <p className="text-gray-600 font-semibold">Dia de Descanso</p>
              <p className="text-gray-400 text-sm">Recuperação é fundamental</p>
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
