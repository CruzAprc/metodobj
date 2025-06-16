
-- Habilitar Row Level Security na tabela user_complete_profile
ALTER TABLE public.user_complete_profile ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas seus próprios dados
CREATE POLICY "Users can view their own complete profile" 
  ON public.user_complete_profile 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para permitir que usuários insiram apenas seus próprios dados
CREATE POLICY "Users can create their own complete profile" 
  ON public.user_complete_profile 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para permitir que usuários atualizem apenas seus próprios dados
CREATE POLICY "Users can update their own complete profile" 
  ON public.user_complete_profile 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política para permitir que usuários deletem apenas seus próprios dados
CREATE POLICY "Users can delete their own complete profile" 
  ON public.user_complete_profile 
  FOR DELETE 
  USING (auth.uid() = user_id);
