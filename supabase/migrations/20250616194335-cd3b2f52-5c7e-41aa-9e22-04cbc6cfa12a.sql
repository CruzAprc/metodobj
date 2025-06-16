
-- Adicionar colunas específicas para cada refeição na tabela dieta
ALTER TABLE public.dieta 
ADD COLUMN cafe_da_manha JSONB DEFAULT '{}',
ADD COLUMN almoco JSONB DEFAULT '{}',
ADD COLUMN lanche JSONB DEFAULT '{}',
ADD COLUMN jantar JSONB DEFAULT '{}',
ADD COLUMN ceia JSONB DEFAULT '{}';

-- Opcional: Remover a coluna refeicoes se não for mais necessária
-- ALTER TABLE public.dieta DROP COLUMN refeicoes;
