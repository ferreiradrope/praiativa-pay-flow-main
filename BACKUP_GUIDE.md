# 💾 Guia de Backup do Banco de Dados

## 🎯 Sobre este Guia

Este guia ensina como fazer backup do banco de dados PostgreSQL do seu projeto PraiAtiva Pay Flow hospedado no Supabase.

## 🚀 Opções de Backup

### 1. 🔧 Backup via Supabase CLI (Recomendado)

#### Instalação do Supabase CLI:
```bash
npm install -g supabase
```

#### Fazer login (apenas uma vez):
```bash
supabase login
```

#### Executar backup:
```powershell
.\backup_database.ps1 -BackupType "supabase-cli"
```

### 2. 🌐 Backup Manual via Dashboard

1. Acesse: https://supabase.com/dashboard/project/nzvdcpzndkbjmojmqskg
2. Vá em **Settings** → **Database**
3. Procure pela opção **Backup** ou **Export**
4. Baixe o arquivo de backup

### 3. 📊 Export de Dados via SQL Editor

1. Acesse: https://supabase.com/dashboard/project/nzvdcpzndkbjmojmqskg/sql
2. Execute os comandos SQL para exportar cada tabela:

```sql
-- Backup instrutores
COPY (SELECT * FROM instrutores_webapp) TO STDOUT WITH CSV HEADER;

-- Backup cobranças
COPY (SELECT * FROM cobrancas) TO STDOUT WITH CSV HEADER;
```

## 📁 Estrutura do Backup

Após executar o backup, você terá:

```
backups/
├── praiativa_backup_2025-01-18_14-30-00.sql
├── praiativa_backup_2025-01-17_09-15-30.sql
└── ...
```

## 🗃️ Tabelas Incluídas no Backup

- **instrutores_webapp**: Dados dos instrutores
- **cobrancas**: Histórico de cobranças
- **Configurações do sistema**: RLS policies, triggers, etc.

## ⚡ Comandos Rápidos

### Windows PowerShell:
```powershell
# Backup padrão
.\backup_database.ps1

# Backup via CLI
.\backup_database.ps1 -BackupType "supabase-cli"

# Backup manual (instruções)
.\backup_database.ps1 -BackupType "manual"
```

### Verificar backups existentes:
```powershell
Get-ChildItem backups\ | Sort-Object CreationTime -Descending
```

## 🔒 Segurança

- ⚠️ **Importante**: Os backups contêm dados sensíveis
- 💾 Armazene em local seguro (Google Drive, Dropbox, etc.)
- 🔐 Considere criptografar backups grandes
- 📅 Mantenha múltiplas versões (backup rotativo)

## 🆘 Restauração

Para restaurar um backup:

### Via Supabase CLI:
```bash
supabase db reset --db-url "postgresql://..." --file backup.sql
```

### Via psql:
```bash
psql "postgresql://postgres:[PASSWORD]@db.nzvdcpzndkbjmojmqskg.supabase.co:5432/postgres" < backup.sql
```

## 📞 Suporte

Se encontrar problemas:

1. 📖 Consulte a documentação do Supabase: https://supabase.com/docs
2. 🔧 Verifique se o Supabase CLI está atualizado
3. 🌐 Teste a conexão com o banco via dashboard

## 📅 Recomendações de Frequência

- **Desenvolvimento**: Backup antes de mudanças importantes
- **Produção**: Backup diário automatizado
- **Dados críticos**: Backup antes de migrações/atualizações

---

💡 **Dica**: Configure um backup automático usando GitHub Actions ou cron jobs para maior segurança!
