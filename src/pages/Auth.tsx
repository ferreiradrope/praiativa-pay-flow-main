import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, Waves, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";

const AuthPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '', nome: '', contato: '' });

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate('/dashboard');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session && event === 'SIGNED_IN') {
          navigate('/dashboard');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Login realizado!",
          description: "Bem-vindo ao PraiAtiva!"
        });

      } else {
        // Sign up
        if (!formData.nome || !formData.contato) {
          throw new Error("Informe nome completo e telefone");
        }
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { nome: formData.nome, contato: formData.contato }
          }
        });

        if (error) throw error;

        // Se o usuário foi criado ou já existe, tentar fazer login
        if (data.user) {
          // Se o usuário precisa confirmar email, vamos tentar fazer login mesmo assim
          if (!data.session) {
            // Tentar fazer login imediatamente
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password,
            });

            if (loginError) {
              throw new Error("Conta criada, mas não foi possível fazer login automaticamente. Tente fazer login manualmente.");
            }
          }

          // Criar perfil básico e instrutor de forma síncrona
          const userId = data.user.id;
          
          // Primeiro cria o perfil
          await supabase.from('profiles').upsert({
            user_id: userId,
            nome: formData.nome,
            contato: formData.contato
          });

          // Depois cria o instrutor (necessário para foreign key em cobrancas)
          const { error: instrutorError } = await supabase.from('instrutores_webapp').upsert({ 
            id: userId, 
            nome_completo: formData.nome, 
            email: formData.email,
            celular: formData.contato,
            senha_hash: 'managed_by_supabase_auth'
          });

          if (instrutorError) {
            console.error('Erro ao criar instrutor:', instrutorError);
            toast({
              title: "Aviso",
              description: "Conta criada, mas houve um problema. Tente fazer logout e login novamente.",
              variant: "destructive"
            });
          }
        }

        toast({
          title: "Cadastro realizado!",
          description: "Bem-vindo ao PraiAtiva! Redirecionando..."
        });

        // Redirecionar automaticamente para o dashboard após 1.5 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Erro de autenticação:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao realizar autenticação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  if (session) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Waves className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PraiAtiva</h1>
          </div>
          <p className="text-xl text-muted-foreground">{isLogin ? 'Faça login para acessar' : 'Crie sua conta'}</p>
        </div>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {isLogin ? 'Login' : 'Cadastro'}
            </CardTitle>
            <CardDescription>{isLogin ? 'Entre com suas credenciais' : 'Preencha seus dados para criar uma conta'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input id="nome" type="text" placeholder="Seu nome completo" value={formData.nome} onChange={(e)=>setFormData({...formData, nome: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contato">WhatsApp *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="contato" type="text" placeholder="(11) 99999-9999" className="pl-10" value={formData.contato} onChange={(e)=>setFormData({...formData, contato: e.target.value})} required />
                    </div>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="seu@email.com" className="pl-10" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="Sua senha" className="pl-10" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} required minLength={6} />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary" disabled={loading}>{loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}</Button>
            </form>
            <Separator className="my-4" />
            <div className="text-center">
              <Button variant="ghost" onClick={()=>setIsLogin(!isLogin)} className="text-sm">{isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}</Button>
            </div>
          </CardContent>
        </Card>
        <div className="text-center mt-6">
          <Button variant="outline" onClick={()=>navigate('/')}>Voltar ao Início</Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;