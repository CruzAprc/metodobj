
-- Adicionar política para permitir INSERT na tabela user_evaluation_access
CREATE POLICY "Users can insert their own evaluation access" ON public.user_evaluation_access
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Verificar se todas as políticas necessárias existem
-- Se a política de INSERT já existir, esta será ignorada devido ao "IF NOT EXISTS" implícito
-- Vamos também garantir que a função de trigger está funcionando corretamente

-- Recriar a função de trigger para garantir que funciona corretamente
CREATE OR REPLACE FUNCTION public.check_evaluation_unlock()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcular data de desbloqueio baseada na data de registro + 7 dias
  SELECT data_registro INTO NEW.unlock_date 
  FROM public.teste_app 
  WHERE user_id = NEW.user_id;
  
  NEW.unlock_date = NEW.unlock_date + INTERVAL '7 days';
  
  -- Verificar se já passou do período necessário
  NEW.is_unlocked = (NEW.unlock_date <= CURRENT_DATE);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
