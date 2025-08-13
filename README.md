# PraiAtiva Pay Flow

Sistema simplificado de gestão de cobranças para instrutores de atividades aquáticas.

## 🌊 Sobre o Projeto

O PraiAtiva Pay Flow é uma aplicação web focada no gerenciamento de cobranças para instrutores de surf, stand-up paddle e outras atividades aquáticas. O sistema permite criar cobranças, gerar links de pagamento via Stripe (cartão/boleto) e PIX via Mercado Pago.

## ✨ Funcionalidades

- **Autenticação simples**: Login/cadastro com email e senha
- **Dashboard de cobranças**: Visualização, filtros e busca
- **Criação de cobranças**: Formulário simples com dados essenciais
- **Integração de pagamentos**:
  - Stripe: Cartão de crédito e boleto
  - Mercado Pago: PIX com QR Code
- **Gestão de links**: Armazenamento dos links/códigos gerados
- **Design responsivo**: Interface moderna com Tailwind CSS

## 🛠️ Tecnologias

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **React Router Dom** para navegação
- **Tailwind CSS** + **shadcn/ui** para interface
- **Lucide React** para ícones
- **React Hook Form** para formulários
- **TanStack Query** para cache de dados

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Edge Functions)
- **Row Level Security (RLS)** para segurança
- **Edge Functions** para integração de pagamentos

### Pagamentos
- **Stripe** (cartão e boleto)
- **Mercado Pago** (PIX)
- **SendGrid** para emails transacionais

## 🗄️ Estrutura do Banco

### Tabela `instrutores_webapp`
```sql
id (UUID, PK)
nome_completo (VARCHAR)
email (VARCHAR, UNIQUE) 
celular (VARCHAR)
senha_hash (VARCHAR)
created_at, updated_at (TIMESTAMP)
```

### Tabela `cobrancas`
```sql
id (UUID, PK)
instrutor_id (UUID, FK)
atividade_servico (VARCHAR)
nome_aluno (VARCHAR)
numero_aluno (VARCHAR)
valor (DECIMAL)
data_vencimento (DATE)
data_emissao (DATE)
link_pagamento_stripe (VARCHAR, nullable)
pix_qrcode_url (VARCHAR, nullable)
pix_copia_cola (VARCHAR, nullable)
gateway_transacao_id (VARCHAR, nullable)
created_at, updated_at (TIMESTAMP)
```

## 🚀 Setup do Projeto

### 1. Clone e instale dependências
```bash
git clone <seu-repositorio>
cd praiativa-pay-flow
npm install
```

### 2. Configuração do Supabase

#### Criar projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e chave anon

#### Criar as tabelas
1. Vá em **SQL Editor** no painel do Supabase
2. Execute o conteúdo do arquivo `CREATE_DATABASE.sql`
3. Se houver problemas com RLS, execute `FIX_RLS_POLICIES.sql`
4. Para resolver foreign key, execute `FIX_FOREIGN_KEY.sql`

#### Configurar Edge Functions
1. No painel Functions, verifique se existem:
   - `create-payment` (Stripe)
   - `create-pix-payment` (Mercado Pago)

### 3. Variáveis de ambiente
Crie arquivo `.env.local`:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

### 4. Executar localmente
```bash
npm run dev
```

Acesse: http://localhost:5173

## 📁 Estrutura de Arquivos

```
src/
├── components/ui/          # Componentes shadcn/ui
├── hooks/                  # Custom hooks
├── integrations/supabase/  # Cliente e tipos Supabase
├── lib/                    # Utilitários
├── pages/                  # Páginas principais
│   ├── Auth.tsx           # Login/Cadastro
│   ├── ChargesDashboard.tsx # Dashboard principal
│   └── ...
└── main.tsx               # Entry point

supabase/
├── config.toml            # Configuração do projeto
├── functions/             # Edge Functions
└── migrations/            # Migrações SQL
```

## 🔧 Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build
npm run lint       # Linter
npm run db:push    # Push migrations (requer Supabase CLI)
```

## 💳 Configuração de Pagamentos

### Stripe
- Configure as chaves no Edge Function `create-payment`
- Suporta cartão de crédito e boleto
- Retorna session URL para checkout

### Mercado Pago
- Configure access token no Edge Function `create-pix-payment`
- Gera PIX com QR Code
- Retorna código copia e cola + URL

### SendGrid
- Usado para envio de emails com links de pagamento
- Configure template ID: `d-3aec26f006994c14b2b8da77f292aaba`

## 🔒 Segurança

- **RLS (Row Level Security)** ativo em todas as tabelas
- Usuários só acessam suas próprias cobranças
- Autenticação via Supabase Auth
- Policies baseadas em `auth.uid()`

## 🚀 Deploy

### Vercel (recomendado)
```bash
npm run build
# Deploy via Vercel CLI ou GitHub integration
```

### Netlify
```bash
npm run build
# Upload da pasta dist/
```

## 🐛 Troubleshooting

### Erro 403 (Forbidden)
- Execute `FIX_RLS_POLICIES.sql`
- Verifique se usuário está autenticado

### Erro 409 (Conflict)
- Execute `FIX_FOREIGN_KEY.sql`
- Certifique-se que existe registro em `instrutores_webapp`

### Tabelas não encontradas
- Execute `CREATE_DATABASE.sql` no Supabase Studio
- Verifique se migrations foram aplicadas

## 📄 Licença

MIT License - veja arquivo LICENSE para detalhes.

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para a comunidade de esportes aquáticos**

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9c6e44ca-3fd6-4a68-877e-c768aeb65ff2) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
