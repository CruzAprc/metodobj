
-- Criar tabela para controlar o desbloqueio da avaliação baseado em dias de uso
CREATE TABLE IF NOT EXISTS public.user_evaluation_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unlock_date DATE NOT NULL,
  days_required INTEGER NOT NULL DEFAULT 7,
  is_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar tabela para armazenar fotos de avaliação
CREATE TABLE IF NOT EXISTS public.evaluation_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type VARCHAR(20) NOT NULL CHECK (photo_type IN ('frente', 'costas', 'lado')),
  evaluation_period DATE NOT NULL, -- Para controlar avaliações mensais
  ai_analysis JSONB, -- Para armazenar análise de IA do shape
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar tabela para análises comparativas mensais
CREATE TABLE IF NOT EXISTS public.monthly_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  evaluation_month DATE NOT NULL, -- Primeiro dia do mês da avaliação
  photos JSONB NOT NULL, -- Array com IDs das fotos desta avaliação
  comparative_analysis JSONB, -- Análise comparativa com período anterior
  body_measurements JSONB, -- Medidas corporais se fornecidas
  progress_score NUMERIC(3,1), -- Score de progresso de 0.0 a 10.0
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, evaluation_month)
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.user_evaluation_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_evaluations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_evaluation_access
CREATE POLICY "Users can view their own evaluation access" ON public.user_evaluation_access
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own evaluation access" ON public.user_evaluation_access
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para evaluation_photos
CREATE POLICY "Users can view their own evaluation photos" ON public.evaluation_photos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own evaluation photos" ON public.evaluation_photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own evaluation photos" ON public.evaluation_photos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own evaluation photos" ON public.evaluation_photos
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para monthly_evaluations
CREATE POLICY "Users can view their own monthly evaluations" ON public.monthly_evaluations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monthly evaluations" ON public.monthly_evaluations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monthly evaluations" ON public.monthly_evaluations
  FOR UPDATE USING (auth.uid() = user_id);

-- Função para calcular se a avaliação deve ser desbloqueada
CREATE OR REPLACE FUNCTION public.check_evaluation_unlock()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcular data de desbloqueio baseada na data de registro + 7 dias
  NEW.unlock_date = (SELECT data_registro FROM public.teste_app WHERE user_id = NEW.user_id) + INTERVAL '7 days';
  
  -- Verificar se já passou do período necessário
  NEW.is_unlocked = (NEW.unlock_date <= CURRENT_DATE);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar automaticamente o status de desbloqueio
CREATE OR REPLACE TRIGGER update_evaluation_unlock
  BEFORE INSERT OR UPDATE ON public.user_evaluation_access
  FOR EACH ROW
  EXECUTE FUNCTION public.check_evaluation_unlock();

-- Função para inicializar o acesso à avaliação quando usuário é criado
CREATE OR REPLACE FUNCTION public.initialize_evaluation_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_evaluation_access (user_id, days_required)
  VALUES (NEW.user_id, 7);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar acesso à avaliação quando usuário se registra no app
CREATE OR REPLACE TRIGGER create_evaluation_access
  AFTER INSERT ON public.teste_app
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_evaluation_access();
