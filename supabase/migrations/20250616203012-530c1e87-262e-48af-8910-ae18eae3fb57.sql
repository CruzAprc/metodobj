
-- Adicionar as colunas que faltam na tabela user_personal_data
ALTER TABLE public.user_personal_data 
ADD COLUMN IF NOT EXISTS data_nascimento DATE,
ADD COLUMN IF NOT EXISTS peso_atual NUMERIC,
ADD COLUMN IF NOT EXISTS sexo TEXT,
ADD COLUMN IF NOT EXISTS nivel_atividade TEXT,
ADD COLUMN IF NOT EXISTS objetivo_principal TEXT,
ADD COLUMN IF NOT EXISTS restricoes_alimentares TEXT,
ADD COLUMN IF NOT EXISTS historico_medico TEXT;

-- Remover a coluna peso antiga se existir e renomear peso_atual
-- (isso é para manter consistência já que o form usa peso_atual)
UPDATE public.user_personal_data SET peso_atual = peso WHERE peso_atual IS NULL AND peso IS NOT NULL;
