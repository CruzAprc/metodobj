
-- Habilitar RLS na tabela treino se não estiver habilitado
ALTER TABLE public.treino ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para a tabela treino se não existirem
DO $$ 
BEGIN
    -- Verificar se a política já existe antes de criar
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'treino' 
        AND policyname = 'Users can view their own treino'
    ) THEN
        CREATE POLICY "Users can view their own treino" 
        ON public.treino 
        FOR SELECT 
        USING (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'treino' 
        AND policyname = 'Users can insert their own treino'
    ) THEN
        CREATE POLICY "Users can insert their own treino" 
        ON public.treino 
        FOR INSERT 
        WITH CHECK (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'treino' 
        AND policyname = 'Users can update their own treino'
    ) THEN
        CREATE POLICY "Users can update their own treino" 
        ON public.treino 
        FOR UPDATE 
        USING (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'treino' 
        AND policyname = 'Users can delete their own treino'
    ) THEN
        CREATE POLICY "Users can delete their own treino" 
        ON public.treino 
        FOR DELETE 
        USING (user_id = auth.uid());
    END IF;
END $$;
