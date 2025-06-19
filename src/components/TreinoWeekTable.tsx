
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
        // Se não conseguir parsear como JSON, tenta extrair informações do texto
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
      return <span className="text-gray-500 text-sm">Sem exercícios definidos</span>;
    }
    
    return exercicios.slice(0, 3).map((exercicio, index) => (
      <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
        <div className="font-medium text-sm">
          {exercicio.nome || exercicio.exercicio || `Exercício ${index + 1}`}
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
    ));
  };

  const renderTreinoContent = (treinoDia: any) => {
    if (!treinoDia) {
      return <span className="text-gray-500">Sem treino</span>;
    }

    // Se tem exercícios estruturados
    if (treinoDia.exercicios && Array.isArray(treinoDia.exercicios) && treinoDia.exercicios.length > 0) {
      return (
        <div>
          {renderExercicios(treinoDia.exercicios)}
          {treinoDia.exercicios.length > 3 && (
            <div className="text-xs text-gray-500 mt-1">
              +{treinoDia.exercicios.length - 3} exercícios
            </div>
          )}
        </div>
      );
    }

    // Se tem descrição de texto
    if (treinoDia.descricao && typeof treinoDia.descricao === 'string') {
      return (
        <div className="text-sm text-gray-700 max-w-xs">
          {treinoDia.descricao.length > 100 
            ? `${treinoDia.descricao.substring(0, 100)}...`
            : treinoDia.descricao
          }
        </div>
      );
    }

    // Se é um objeto com propriedades
    if (typeof treinoDia === 'object') {
      return (
        <div className="text-sm text-gray-700">
          <div>Treino personalizado disponível</div>
          {treinoDia.foco && (
            <div className="text-xs text-blue-600 mt-1">
              Foco: {treinoDia.foco}
            </div>
          )}
        </div>
      );
    }

    return <span className="text-gray-500">Dados disponíveis</span>;
  };

  console.log('TreinoWeekTable: Dados completos do treino:', treinoData);

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
                <TableHead>Exercícios/Conteúdo</TableHead>
                <TableHead>Duração</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diasSemana.map((dia) => {
                const treinoDiaRaw = treinoData[dia.key as keyof TreinoData];
                console.log(`TreinoWeekTable: ${dia.nome} - dados brutos:`, treinoDiaRaw);
                
                const treinoDia = formatTreinoData(treinoDiaRaw);
                console.log(`TreinoWeekTable: ${dia.nome} - dados formatados:`, treinoDia);
                
                return (
                  <TableRow key={dia.key}>
                    <TableCell className="font-medium">{dia.nome}</TableCell>
                    <TableCell>
                      {treinoDia?.foco || 'Não definido'}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {renderTreinoContent(treinoDia)}
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
