
-- Criar tabela para dados dos usuários do app
CREATE TABLE public.teste_app (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  nome VARCHAR NOT NULL,
  whatsapp VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  data_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  quiz_alimentar_concluido BOOLEAN NOT NULL DEFAULT false,
  quiz_treino_concluido BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para anamnese alimentar
CREATE TABLE public.teste_dieta (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  cafe_da_manha JSONB NOT NULL DEFAULT '{"naoGosta": []}'::jsonb,
  almoco JSONB NOT NULL DEFAULT '{"naoGosta": []}'::jsonb,
  lanche JSONB NOT NULL DEFAULT '{"naoGosta": []}'::jsonb,
  jantar JSONB NOT NULL DEFAULT '{"naoGosta": []}'::jsonb,
  ceia JSONB NOT NULL DEFAULT '{"naoGosta": []}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para anamnese de treino
CREATE TABLE public.teste_treino (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  lesoes VARCHAR NOT NULL,
  lesao_especifica TEXT,
  objetivo VARCHAR NOT NULL,
  tempo_sessao VARCHAR NOT NULL,
  frequencia VARCHAR NOT NULL,
  experiencia VARCHAR NOT NULL,
  foco_regiao VARCHAR NOT NULL,
  intensidade VARCHAR NOT NULL,
  desafio VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS) nas tabelas
ALTER TABLE public.teste_app ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teste_dieta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teste_treino ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para teste_app
CREATE POLICY "Usuários podem ver seus próprios dados" 
  ON public.teste_app 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios dados" 
  ON public.teste_app 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios dados" 
  ON public.teste_app 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Políticas RLS para teste_dieta
CREATE POLICY "Usuários podem ver sua própria dieta" 
  ON public.teste_dieta 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar sua própria dieta" 
  ON public.teste_dieta 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar sua própria dieta" 
  ON public.teste_dieta 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Políticas RLS para teste_treino
CREATE POLICY "Usuários podem ver seu próprio treino" 
  ON public.teste_treino 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seu próprio treino" 
  ON public.teste_treino 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio treino" 
  ON public.teste_treino 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_teste_app_updated_at BEFORE UPDATE ON public.teste_app FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teste_dieta_updated_at BEFORE UPDATE ON public.teste_dieta FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teste_treino_updated_at BEFORE UPDATE ON public.teste_treino FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
