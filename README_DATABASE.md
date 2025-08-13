# Criação do Banco de Dados - PraiAtiva Pay Flow

## Passo a Passo para Criar as Tabelas no Supabase

### 1. Acesse o Supabase Studio
1. Abra o navegador e vá para: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto: **nzvdcpzndkbjmojmqskg**

### 2. Execute o SQL
1. No painel lateral esquerdo, clique em **SQL Editor**
2. Clique em **New query**
3. Copie todo o conteúdo do arquivo `CREATE_DATABASE.sql` (na raiz do projeto)
4. Cole no editor SQL
5. Clique em **Run** (ou pressione Ctrl+Enter)

### 3. Verificar se deu certo
Após executar o SQL, você deve ver:
- Mensagem: "Tabelas criadas com sucesso!"
- No painel lateral, clique em **Table Editor**
- Deve aparecer duas novas tabelas:
  - `instrutores_webapp`
  - `cobrancas`

### 4. Estrutura das Tabelas Criadas

#### instrutores_webapp
- `id` (UUID, PK)
- `nome_completo` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `celular` (VARCHAR)
- `senha_hash` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### cobrancas
- `id` (UUID, PK)
- `instrutor_id` (UUID, FK para instrutores_webapp.id)
- `atividade_servico` (VARCHAR)
- `nome_aluno` (VARCHAR)
- `numero_aluno` (VARCHAR)
- `valor` (DECIMAL(12,2))
- `data_vencimento` (DATE)
- `data_emissao` (DATE)
- `link_pagamento_stripe` (VARCHAR, nullable)
- `pix_qrcode_url` (VARCHAR, nullable)
- `pix_copia_cola` (VARCHAR, nullable)
- `gateway_transacao_id` (VARCHAR, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 5. Após Criar as Tabelas

1. **Teste o app**: Execute `npm run dev` e acesse http://localhost:5173
2. **Faça logout** se estiver logado
3. **Crie uma nova conta** (isso criará um registro em instrutores_webapp)
4. **Acesse o dashboard** e teste criar uma cobrança
5. **Teste os pagamentos** (Cartão/PIX) para ver se os links são gerados

### 6. Verificação no Supabase Studio

Depois de usar o app, volte ao Table Editor e verifique:
- `instrutores_webapp` deve ter pelo menos 1 registro (sua conta)
- `cobrancas` deve ter os registros que você criou
- Quando gerar links de pagamento, os campos `link_pagamento_stripe` ou `pix_qrcode_url` devem ser preenchidos

## Troubleshooting

### Se der erro de RLS (Row Level Security):
1. Verifique se você está logado no app
2. O email usado no login deve corresponder ao registro em `instrutores_webapp`

### Se não conseguir criar cobrança:
1. Certifique-se que existe um registro em `instrutores_webapp` com seu email
2. No SQL Editor, execute: `SELECT * FROM instrutores_webapp;`

### Se os links de pagamento não funcionarem:
1. Verifique se as Supabase Edge Functions estão ativas
2. No painel Functions, deve ter: `create-payment` e `create-pix-payment`

## Comandos Úteis (SQL Editor)

```sql
-- Ver todos os instrutores
SELECT * FROM instrutores_webapp;

-- Ver todas as cobranças
SELECT * FROM cobrancas;

-- Ver cobranças com dados do instrutor
SELECT c.*, i.nome_completo, i.email 
FROM cobrancas c 
JOIN instrutores_webapp i ON c.instrutor_id = i.id;

-- Limpar dados para teste
DELETE FROM cobrancas;
DELETE FROM instrutores_webapp;
```
