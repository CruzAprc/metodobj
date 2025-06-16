
-- Criar tabela para armazenar os treinos personalizados
CREATE TABLE public.treino (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  universal_id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Dados do quiz de treino
  quiz_data JSONB,
  
  -- Treinos por dia da semana
  segunda_feira JSONB,
  terca_feira JSONB,
  quarta_feira JSONB,
  quinta_feira JSONB,
  sexta_feira JSONB,
  sabado JSONB,
  domingo JSONB,
  
  -- Treinos ABCDE (caso necessário)
  treino_a JSONB,
  treino_b JSONB,
  treino_c JSONB,
  treino_d JSONB,
  treino_e JSONB,
  
  -- Status e metadados
  ativo BOOLEAN DEFAULT true,
  nome_plano TEXT,
  descricao TEXT,
  webhook_received_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.treino ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para usuários verem apenas seus próprios treinos
CREATE POLICY "Users can view their own treino" 
  ON public.treino 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own treino" 
  ON public.treino 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own treino" 
  ON public.treino 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own treino" 
  ON public.treino 
  FOR DELETE 
  USING (user_id = auth.uid());
