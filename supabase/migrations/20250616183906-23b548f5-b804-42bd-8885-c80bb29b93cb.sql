
-- Adicionar coluna universal_id à tabela dieta
ALTER TABLE public.dieta 
ADD COLUMN universal_id UUID NOT NULL DEFAULT gen_random_uuid();

-- Criar índice para melhor performance nas consultas por universal_id
CREATE INDEX idx_dieta_universal_id ON public.dieta(universal_id);

-- Criar índice composto para consultas por user_id e universal_id
CREATE INDEX idx_dieta_user_universal ON public.dieta(user_id, universal_id);
