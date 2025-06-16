
-- Criar tabela consolidada com todos os dados do usuário
CREATE TABLE public.user_complete_profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  universal_id UUID NOT NULL DEFAULT gen_random_uuid(),
  
  -- Dados Pessoais
  nome_completo TEXT,
  data_nascimento DATE,
  altura NUMERIC,
  peso_atual NUMERIC,
  sexo TEXT,
  
  -- Quiz Alimentar
  objetivo_alimentar TEXT,
  restricoes_alimentares TEXT[],
  preferencias_alimentares TEXT[],
  frequencia_refeicoes TEXT,
  nivel_atividade TEXT,
  alergias TEXT[],
  suplementos TEXT[],
  horario_preferencia TEXT,
  orcamento TEXT,
  
  -- Quiz Treino
  experiencia_treino TEXT,
  frequencia_treino TEXT,
  objetivo_treino TEXT,
  limitacoes_fisicas TEXT[],
  preferencias_treino TEXT[],
  tempo_disponivel TEXT,
  
  -- Status de completude
  dados_pessoais_completed BOOLEAN DEFAULT FALSE,
  quiz_alimentar_completed BOOLEAN DEFAULT FALSE,
  quiz_treino_completed BOOLEAN DEFAULT FALSE,
  all_data_completed BOOLEAN DEFAULT FALSE,
  
  -- Controle de webhook
  webhook_sent BOOLEAN DEFAULT FALSE,
  webhook_sent_at TIMESTAMP WITH TIME ZONE,
  webhook_response JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_user_complete_profile_updated_at
  BEFORE UPDATE ON public.user_complete_profile
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para verificar se todos os dados foram completados
CREATE OR REPLACE FUNCTION public.check_complete_profile_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se todos os dados necessários foram preenchidos
  NEW.all_data_completed = (
    NEW.dados_pessoais_completed = TRUE AND
    NEW.quiz_alimentar_completed = TRUE AND
    NEW.quiz_treino_completed = TRUE
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_profile_completion
  BEFORE INSERT OR UPDATE ON public.user_complete_profile
  FOR EACH ROW
  EXECUTE FUNCTION public.check_complete_profile_status();

-- Função para consolidar dados do usuário
CREATE OR REPLACE FUNCTION public.consolidate_user_data(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
  profile_id UUID;
  personal_data RECORD;
  alimentar_data JSONB;
  treino_data JSONB;
BEGIN
  -- Buscar dados pessoais
  SELECT * INTO personal_data
  FROM public.user_personal_data
  WHERE user_id = p_user_id;
  
  -- Buscar dados do quiz alimentar
  SELECT quiz_data INTO alimentar_data
  FROM public.user_quiz_data
  WHERE user_id = p_user_id AND quiz_type = 'alimentar';
  
  -- Buscar dados do quiz treino
  SELECT quiz_data INTO treino_data
  FROM public.user_quiz_data
  WHERE user_id = p_user_id AND quiz_type = 'treino';
  
  -- Inserir ou atualizar perfil consolidado
  INSERT INTO public.user_complete_profile (
    user_id,
    nome_completo,
    data_nascimento,
    altura,
    peso_atual,
    sexo,
    objetivo_alimentar,
    restricoes_alimentares,
    preferencias_alimentares,
    frequencia_refeicoes,
    nivel_atividade,
    alergias,
    suplementos,
    horario_preferencia,
    orcamento,
    experiencia_treino,
    frequencia_treino,
    objetivo_treino,
    limitacoes_fisicas,
    preferencias_treino,
    tempo_disponivel,
    dados_pessoais_completed,
    quiz_alimentar_completed,
    quiz_treino_completed
  ) VALUES (
    p_user_id,
    personal_data.nome_completo,
    personal_data.data_nascimento,
    personal_data.altura,
    personal_data.peso_atual,
    personal_data.sexo,
    alimentar_data->>'objetivo',
    ARRAY(SELECT jsonb_array_elements_text(alimentar_data->'restricoes')),
    ARRAY(SELECT jsonb_array_elements_text(alimentar_data->'preferenciasAlimentares')),
    alimentar_data->>'frequenciaRefeicoes',
    alimentar_data->>'nivelAtividade',
    ARRAY(SELECT jsonb_array_elements_text(alimentar_data->'alergias')),
    ARRAY(SELECT jsonb_array_elements_text(alimentar_data->'suplementos')),
    alimentar_data->>'horarioPreferencia',
    alimentar_data->>'orcamento',
    treino_data->>'experiencia',
    treino_data->>'frequencia',
    treino_data->>'objetivo',
    ARRAY(SELECT jsonb_array_elements_text(treino_data->'limitacoes')),
    ARRAY(SELECT jsonb_array_elements_text(treino_data->'preferencias')),
    treino_data->>'tempo_disponivel',
    CASE WHEN personal_data.id IS NOT NULL THEN TRUE ELSE FALSE END,
    CASE WHEN alimentar_data IS NOT NULL THEN TRUE ELSE FALSE END,
    CASE WHEN treino_data IS NOT NULL THEN TRUE ELSE FALSE END
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    nome_completo = EXCLUDED.nome_completo,
    data_nascimento = EXCLUDED.data_nascimento,
    altura = EXCLUDED.altura,
    peso_atual = EXCLUDED.peso_atual,
    sexo = EXCLUDED.sexo,
    objetivo_alimentar = EXCLUDED.objetivo_alimentar,
    restricoes_alimentares = EXCLUDED.restricoes_alimentares,
    preferencias_alimentares = EXCLUDED.preferencias_alimentares,
    frequencia_refeicoes = EXCLUDED.frequencia_refeicoes,
    nivel_atividade = EXCLUDED.nivel_atividade,
    alergias = EXCLUDED.alergias,
    suplementos = EXCLUDED.suplementos,
    horario_preferencia = EXCLUDED.horario_preferencia,
    orcamento = EXCLUDED.orcamento,
    experiencia_treino = EXCLUDED.experiencia_treino,
    frequencia_treino = EXCLUDED.frequencia_treino,
    objetivo_treino = EXCLUDED.objetivo_treino,
    limitacoes_fisicas = EXCLUDED.limitacoes_fisicas,
    preferencias_treino = EXCLUDED.preferencias_treino,
    tempo_disponivel = EXCLUDED.tempo_disponivel,
    dados_pessoais_completed = EXCLUDED.dados_pessoais_completed,
    quiz_alimentar_completed = EXCLUDED.quiz_alimentar_completed,
    quiz_treino_completed = EXCLUDED.quiz_treino_completed,
    updated_at = now()
  RETURNING id INTO profile_id;
  
  RETURN profile_id;
END;
$$ LANGUAGE plpgsql;

-- Adicionar constraint unique para user_id
ALTER TABLE public.user_complete_profile ADD CONSTRAINT unique_user_profile UNIQUE (user_id);
