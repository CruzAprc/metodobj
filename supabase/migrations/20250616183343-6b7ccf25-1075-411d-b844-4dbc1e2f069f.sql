
-- Criar tabela dieta para armazenar planos alimentares
CREATE TABLE public.dieta (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome_dieta TEXT NOT NULL,
  descricao TEXT,
  calorias_totais INTEGER,
  refeicoes JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ativa BOOLEAN DEFAULT true
);

-- Adicionar RLS para segurança
ALTER TABLE public.dieta ENABLE ROW LEVEL SECURITY;

-- Política para visualizar apenas as próprias dietas
CREATE POLICY "Users can view their own dietas" 
  ON public.dieta 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para criar dietas
CREATE POLICY "Users can create their own dietas" 
  ON public.dieta 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para atualizar suas próprias dietas
CREATE POLICY "Users can update their own dietas" 
  ON public.dieta 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para deletar suas próprias dietas
CREATE POLICY "Users can delete their own dietas" 
  ON public.dieta 
  FOR DELETE 
  USING (auth.uid() = user_id);
