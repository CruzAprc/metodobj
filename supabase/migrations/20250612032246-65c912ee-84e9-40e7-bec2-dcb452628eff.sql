
-- Adicionar coluna motivacao_lida à tabela user_daily_progress
ALTER TABLE public.user_daily_progress 
ADD COLUMN IF NOT EXISTS motivacao_lida BOOLEAN NOT NULL DEFAULT false;
