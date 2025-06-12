
-- Criar tabela para armazenar o progresso diário dos usuários
CREATE TABLE public.user_daily_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  treino_realizado BOOLEAN NOT NULL DEFAULT false,
  dieta_seguida BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Habilitar RLS
ALTER TABLE public.user_daily_progress ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para garantir que usuários só vejam seus próprios dados
CREATE POLICY "Users can view their own progress" 
  ON public.user_daily_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
  ON public.user_daily_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON public.user_daily_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" 
  ON public.user_daily_progress 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_daily_progress_updated_at 
  BEFORE UPDATE ON public.user_daily_progress 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
