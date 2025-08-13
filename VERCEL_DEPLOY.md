# 🚀 Deploy no Vercel - PraiAtiva Pay Flow

Este guia te ajudará a fazer o deploy do seu projeto no Vercel.

## 📋 Pré-requisitos

1. **Conta no Vercel**: Crie em [vercel.com](https://vercel.com)
2. **Conta no GitHub**: Seu projeto já está no GitHub ✅
3. **Projeto Supabase**: Configure seu banco de dados no Supabase

## 🎯 Passo a Passo para Deploy

### 1. **Acesse o Vercel**
- Vá para [vercel.com](https://vercel.com)
- Faça login com sua conta GitHub

### 2. **Importar Projeto**
- Clique em **"New Project"**
- Selecione **"Import Git Repository"**
- Escolha seu repositório: `ferreiradrope/praiativa-pay-flow-main`

### 3. **Configurar o Projeto**
- **Framework Preset**: Vite (será detectado automaticamente)
- **Root Directory**: `.` (raiz do projeto)
- **Build Command**: `npm run build` (padrão)
- **Output Directory**: `dist` (padrão)
- **Install Command**: `npm install` (padrão)

### 4. **Configurar Variáveis de Ambiente**
Na seção **Environment Variables**, adicione:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Sua URL do Supabase (ex: https://seu-projeto.supabase.co) |
| `VITE_SUPABASE_ANON_KEY` | Sua chave anônima do Supabase |

**Como obter as chaves do Supabase:**
1. Acesse [supabase.com](https://supabase.com) → Seu projeto
2. Vá em **Settings** → **API**
3. Copie a **URL** e **anon public** key

### 5. **Deploy**
- Clique em **"Deploy"**
- Aguarde o build (3-5 minutos)
- Seu projeto estará online! 🎉

## 🔧 Configurações Avançadas

### Domínio Personalizado (Opcional)
1. Vá em **Settings** → **Domains**
2. Adicione seu domínio personalizado
3. Configure o DNS conforme instruções

### Variáveis de Ambiente por Ambiente
- **Production**: Para o site live
- **Preview**: Para branches de teste
- **Development**: Para desenvolvimento local

## 🛠️ Solução de Problemas

### ❌ **Erro de Build**
- Verifique se todas as dependências estão no `package.json`
- Confirme se não há erros de TypeScript
- Teste localmente: `npm run build`

### ❌ **Erro 404 nas Rotas**
- O arquivo `vercel.json` já está configurado para SPA ✅
- Todas as rotas redirecionam para `index.html`

### ❌ **Erro de Conexão com Supabase**
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Teste a conexão localmente primeiro

### ❌ **Problemas com Edge Functions**
- Edge Functions do Supabase funcionam normalmente no Vercel
- Certifique-se de que as URLs estão corretas
- Verifique os logs no Supabase Dashboard

## 📦 Arquivos de Configuração

Este projeto inclui:
- ✅ `vercel.json` - Configuração do Vercel
- ✅ `.env.example` - Exemplo de variáveis de ambiente
- ✅ Build otimizado para produção

## 🚀 Após o Deploy

1. **Teste todas as funcionalidades**:
   - Login/Cadastro
   - Criação de cobranças
   - Geração de links de pagamento
   - Dashboard de cobranças

2. **Configure seu banco de dados**:
   - Execute o `CREATE_DATABASE.sql` no Supabase
   - Use os scripts de correção se necessário

3. **Monitore**:
   - Vercel Dashboard para logs de build
   - Supabase Dashboard para logs do banco

## 🎯 URL Final

Após o deploy, sua aplicação estará disponível em:
```
https://seu-projeto-vercel.app
```

---

**🎊 Parabéns! Seu sistema de cobranças está online!**

Para suporte adicional, consulte:
- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Supabase](https://supabase.com/docs)
