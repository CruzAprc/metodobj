
-- Criar tabela para armazenar fotos dos usuários
CREATE TABLE public.user_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type VARCHAR(20) NOT NULL CHECK (photo_type IN ('frente', 'costas', 'lado')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.user_photos ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para fotos
CREATE POLICY "Users can view their own photos" 
  ON public.user_photos 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own photos" 
  ON public.user_photos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos" 
  ON public.user_photos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" 
  ON public.user_photos 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_user_photos_updated_at
    BEFORE UPDATE ON public.user_photos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
