-- EXECUTE ESTE SQL PARA CORRIGIR O ERRO 409 (FOREIGN KEY)
-- =========================================================

-- 1. Primeiro, vamos ver qual é o seu auth.uid()
SELECT auth.uid() as seu_user_id;

-- 2. Verificar se existe registro em instrutores_webapp
SELECT * FROM instrutores_webapp WHERE id = auth.uid();

-- 3. Se não existir, vamos criar um registro temporário para o usuário atual
-- (substitua os dados pelos seus reais)
INSERT INTO instrutores_webapp (id, nome_completo, email, celular, senha_hash)
SELECT 
  auth.uid(),
  COALESCE(auth.jwt()->>'nome', 'Nome Temporário'),
  COALESCE(auth.jwt()->>'email', auth.email()),
  COALESCE(auth.jwt()->>'contato', '(00) 00000-0000'),
  'managed_by_supabase_auth'
WHERE auth.uid() IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM instrutores_webapp WHERE id = auth.uid())
ON CONFLICT (id) DO NOTHING;

-- 4. Verificar se agora existe
SELECT * FROM instrutores_webapp WHERE id = auth.uid();

-- 5. Se ainda não funcionar, vamos criar manualmente
-- DESCOMENTE E EXECUTE APENAS SE NECESSÁRIO:
-- INSERT INTO instrutores_webapp (id, nome_completo, email, celular, senha_hash) 
-- VALUES (
--   'SEU_USER_ID_AQUI',  -- Cole o UUID retornado pela primeira query
--   'Seu Nome Completo',
--   'seu@email.com',
--   '(11) 99999-9999',
--   'managed_by_supabase_auth'
-- ) ON CONFLICT (id) DO NOTHING;

SELECT 'Instrutor criado com sucesso!' as status;
