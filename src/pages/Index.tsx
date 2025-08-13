import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves, MessageCircle, Clock, CheckCircle, TrendingUp, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.open('https://wa.me/5521991732847', '_blank');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 pt-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Waves className="h-12 w-12 text-primary" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PraiAtiva
            </h1>
          </div>
          <p className="text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            <strong>Revolucione o controle das suas cobranças!</strong> Sistema inteligente para instrutores 
            de atividades aquáticas que automatiza pagamentos, organiza alunos e multiplica sua produtividade.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg" 
              className="gradient-primary text-lg px-8 py-6 shadow-glow"
            >
              Entrar / Cadastrar
            </Button>
            <Button 
              onClick={openWhatsApp}
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar com Chatbot
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle className="text-lg">Economia de Tempo</CardTitle>
              <CardDescription>
                Automatize a criação de cobranças e links de pagamento. 
                O que levava horas agora leva minutos!
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle className="text-lg">Controle Total</CardTitle>
              <CardDescription>
                Visualize todas as cobranças em uma tela. Status de pagamento, 
                valores e datas organizados de forma clara.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle className="text-lg">Mais Produtividade</CardTitle>
              <CardDescription>
                Foque no que importa: dar aulas! Deixe a gestão financeira 
                automatizada e organizada para você.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-orange-500" />
              </div>
              <CardTitle className="text-lg">Pagamento Fácil</CardTitle>
              <CardDescription>
                Links seguros com PIX, cartão e boleto. Seus alunos pagam 
                de forma rápida e você recebe na hora!
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
