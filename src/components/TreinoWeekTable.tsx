
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

type TreinoData = Tables<'treino'>;

interface TreinoWeekTableProps {
  treinoData: TreinoData;
}

const TreinoWeekTable = ({ treinoData }: TreinoWeekTableProps) => {
  const diasSemana = [
    { key: 'segunda_feira', nome: 'Segunda-feira' },
    { key: 'terca_feira', nome: 'Terça-feira' },
    { key: 'quarta_feira', nome: 'Quarta-feira' },
    { key: 'quinta_feira', nome: 'Quinta-feira' },
    { key: 'sexta_feira', nome: 'Sexta-feira' },
    { key: 'sabado', nome: 'Sábado' },
    { key: 'domingo', nome: 'Domingo' }
  ];

  const formatTreinoData = (treinoRaw: any): any => {
    if (!treinoRaw) return null;
    
    // Se já é um objeto, retorna como está
    if (typeof treinoRaw === 'object' && treinoRaw !== null) {
      return treinoRaw;
    }
    
    // Se é uma string, tenta parsear como JSON
    if (typeof treinoRaw === 'string') {
      try {
        return JSON.parse(treinoRaw);
      } catch (error) {
        console.log('Erro ao parsear JSON:', error);
        return null;
      }
    }
    
    return null;
  };

  const renderExercicios = (exercicios: any[]) => {
    if (!Array.isArray(exercicios)) return 'Dados não disponíveis';
    
    return exercicios.map((exercicio, index) => (
      <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
        <div className="font-medium text-sm">
          {exercicio.nome || exercicio.exercicio || 'Exercício'}
        </div>
        {exercicio.series && exercicio.repeticoes && (
          <div className="text-xs text-gray-600">
            {exercicio.series} séries x {exercicio.repeticoes} repetições
          </div>
        )}
        {exercicio.carga && (
          <div className="text-xs text-gray-600">
            Carga: {exercicio.carga}
          </div>
        )}
      </div>
    )).slice(0, 3); // Limitar a 3 exercícios por célula para não ficar muito grande
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cronograma Semanal de Treinos</CardTitle>
        {treinoData.nome_plano && (
          <p className="text-sm text-gray-600">{treinoData.nome_plano}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dia da Semana</TableHead>
                <TableHead>Foco</TableHead>
                <TableHead>Exercícios</TableHead>
                <TableHead>Duração</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diasSemana.map((dia) => {
                const treinoDiaRaw = treinoData[dia.key as keyof TreinoData];
                const treinoDia = formatTreinoData(treinoDiaRaw);
                
                return (
                  <TableRow key={dia.key}>
                    <TableCell className="font-medium">{dia.nome}</TableCell>
                    <TableCell>
                      {treinoDia?.foco || 'Não definido'}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {treinoDia?.exercicios ? (
                        <div>
                          {renderExercicios(treinoDia.exercicios)}
                          {treinoDia.exercicios.length > 3 && (
                            <div className="text-xs text-gray-500 mt-1">
                              +{treinoDia.exercicios.length - 3} exercícios
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">Sem treino</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {treinoDia?.duracao || 'Não definido'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {treinoData.descricao && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Observações:</h4>
            <p className="text-sm text-gray-700">{treinoData.descricao}</p>
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-500">
          Plano criado em: {new Date(treinoData.webhook_received_at || treinoData.created_at).toLocaleDateString('pt-BR')}
        </div>
      </CardContent>
    </Card>
  );
};

export default TreinoWeekTable;
