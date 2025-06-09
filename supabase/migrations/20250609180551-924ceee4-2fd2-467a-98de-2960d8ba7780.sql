
-- Adicionar coluna para armazenar os dias no app na tabela teste_app
ALTER TABLE public.teste_app 
ADD COLUMN dias_no_app INTEGER NOT NULL DEFAULT 0;

-- Criar função para calcular dias automaticamente baseado na data de registro
CREATE OR REPLACE FUNCTION calculate_dias_no_app()
RETURNS TRIGGER AS $$
BEGIN
    NEW.dias_no_app = EXTRACT(DAY FROM (NOW() - NEW.data_registro))::INTEGER;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar automaticamente os dias quando necessário
CREATE TRIGGER update_dias_no_app_trigger
    BEFORE UPDATE ON public.teste_app
    FOR EACH ROW
    EXECUTE FUNCTION calculate_dias_no_app();

-- Atualizar registros existentes com os dias calculados
UPDATE public.teste_app 
SET dias_no_app = EXTRACT(DAY FROM (NOW() - data_registro))::INTEGER;
