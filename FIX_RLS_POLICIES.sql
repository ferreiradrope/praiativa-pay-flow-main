-- EXECUTE ESTE SQL PARA CORRIGIR O ERRO 403
-- ============================================

-- Remove as policies antigas
DROP POLICY IF EXISTS "instrutor can select self" ON public.instrutores_webapp;
DROP POLICY IF EXISTS "instrutor can insert self" ON public.instrutores_webapp;
DROP POLICY IF EXISTS "instrutor can update self" ON public.instrutores_webapp;
DROP POLICY IF EXISTS "own charges select" ON public.cobrancas;
DROP POLICY IF EXISTS "own charges insert" ON public.cobrancas;
DROP POLICY IF EXISTS "own charges update" ON public.cobrancas;
DROP POLICY IF EXISTS "own charges delete" ON public.cobrancas;

-- Cria as policies corretas usando auth.uid()
CREATE POLICY "instrutor can select self" ON public.instrutores_webapp 
FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "instrutor can insert self" ON public.instrutores_webapp 
FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "instrutor can update self" ON public.instrutores_webapp 
FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "own charges select" ON public.cobrancas 
FOR SELECT USING (auth.uid()::text = instrutor_id::text);

CREATE POLICY "own charges insert" ON public.cobrancas 
FOR INSERT WITH CHECK (auth.uid()::text = instrutor_id::text);

CREATE POLICY "own charges update" ON public.cobrancas 
FOR UPDATE USING (auth.uid()::text = instrutor_id::text);

CREATE POLICY "own charges delete" ON public.cobrancas 
FOR DELETE USING (auth.uid()::text = instrutor_id::text);

SELECT 'RLS Policies corrigidas!' as status;
