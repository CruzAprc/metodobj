
-- Criar tabela centralizada para dados completos do usuário
CREATE TABLE public.user_complete_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  universal_id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  user_id UUID NOT NULL,
  
  -- Dados pessoais
  nome_completo TEXT,
  idade INTEGER,
  peso NUMERIC,
  altura NUMERIC,
  
  -- Dados do quiz alimentar
  quiz_alimentar_data JSONB,
  quiz_alimentar_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Dados do quiz de treino
  quiz_treino_data JSONB,
  quiz_treino_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Status de conclusão
  dados_pessoais_completed BOOLEAN DEFAULT FALSE,
  quiz_alimentar_completed BOOLEAN DEFAULT FALSE,
  quiz_treino_completed BOOLEAN DEFAULT FALSE,
  all_data_completed BOOLEAN DEFAULT FALSE,
  
  -- Webhook
  webhook_sent BOOLEAN DEFAULT FALSE,
  webhook_sent_at TIMESTAMP WITH TIME ZONE,
  webhook_response JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS
ALTER TABLE public.user_complete_data ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own complete data" 
  ON public.user_complete_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own complete data" 
  ON public.user_complete_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own complete data" 
  ON public.user_complete_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_user_complete_data_updated_at 
    BEFORE UPDATE ON public.user_complete_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Função para verificar se todos os dados foram preenchidos e atualizar o status
CREATE OR REPLACE FUNCTION check_and_update_completion_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se todos os dados necessários foram preenchidos
    NEW.all_data_completed = (
        NEW.dados_pessoais_completed = TRUE AND
        NEW.quiz_alimentar_completed = TRUE AND
        NEW.quiz_treino_completed = TRUE
    );
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para verificar completion status
CREATE TRIGGER check_completion_status_trigger
    BEFORE INSERT OR UPDATE ON public.user_complete_data
    FOR EACH ROW
    EXECUTE FUNCTION check_and_update_completion_status();
