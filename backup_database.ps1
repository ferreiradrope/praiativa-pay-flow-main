# Script de Backup do Banco de Dados - PraiAtiva Pay Flow
# Supabase PostgreSQL Database Backup Script

param(
    [string]$BackupType = "supabase-cli",
    [string]$OutputDir = "backups"
)

# Configurações
$PROJECT_ID = "nzvdcpzndkbjmojmqskg"
$DATE_STAMP = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BACKUP_NAME = "praiativa_backup_$DATE_STAMP"

# Criar diretório de backup se não existir
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir
    Write-Host "✅ Diretório de backup criado: $OutputDir" -ForegroundColor Green
}

Write-Host "🚀 Iniciando backup do banco de dados PraiAtiva Pay Flow..." -ForegroundColor Cyan
Write-Host "📅 Data/Hora: $(Get-Date)" -ForegroundColor Yellow
Write-Host "🆔 Project ID: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "📁 Tipo de backup: $BackupType" -ForegroundColor Yellow

switch ($BackupType) {
    "supabase-cli" {
        Write-Host "`n🔧 Realizando backup via Supabase CLI..." -ForegroundColor Blue
        
        # Verificar se o Supabase CLI está instalado
        try {
            $supabaseVersion = supabase --version
            Write-Host "✅ Supabase CLI encontrado: $supabaseVersion" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Supabase CLI não encontrado!" -ForegroundColor Red
            Write-Host "📝 Para instalar: npm install -g supabase" -ForegroundColor Yellow
            exit 1
        }

        # Fazer backup completo via CLI
        $backupPath = "$OutputDir\$BACKUP_NAME.sql"
        Write-Host "📥 Exportando estrutura e dados para: $backupPath" -ForegroundColor Blue
        
        # Comando para backup via Supabase CLI
        Write-Host "🔑 Você precisará fazer login no Supabase CLI se ainda não fez:" -ForegroundColor Yellow
        Write-Host "   supabase login" -ForegroundColor Gray
        
        $cmd = "supabase db dump --project-id $PROJECT_ID --file `"$backupPath`""
        Write-Host "🔄 Executando: $cmd" -ForegroundColor Gray
        
        try {
            Invoke-Expression $cmd
            if (Test-Path $backupPath) {
                $fileSize = (Get-Item $backupPath).Length / 1KB
                Write-Host "✅ Backup concluído com sucesso!" -ForegroundColor Green
                Write-Host "📊 Tamanho do arquivo: $([math]::Round($fileSize, 2)) KB" -ForegroundColor Green
                Write-Host "📁 Arquivo salvo em: $backupPath" -ForegroundColor Green
            }
        }
        catch {
            Write-Host "❌ Erro ao executar backup via CLI: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    "pg_dump" {
        Write-Host "`n🔧 Realizando backup via pg_dump..." -ForegroundColor Blue
        Write-Host "⚠️  Para usar pg_dump, você precisa:" -ForegroundColor Yellow
        Write-Host "   1. Instalar PostgreSQL client tools" -ForegroundColor Gray
        Write-Host "   2. Obter a connection string do Supabase" -ForegroundColor Gray
        Write-Host "   3. Configurar as variáveis de ambiente" -ForegroundColor Gray
        
        # Exemplo de comando pg_dump (usuário precisa configurar)
        $pgDumpExample = @"
# Exemplo de comando pg_dump:
# Substitua pelos seus dados reais do Supabase

pg_dump "postgresql://postgres:[SUA_SENHA]@db.nzvdcpzndkbjmojmqskg.supabase.co:5432/postgres" `
  --file="$OutputDir\$BACKUP_NAME.sql" `
  --verbose `
  --clean `
  --no-owner `
  --no-privileges `
  --exclude-schema=auth `
  --exclude-schema=storage `
  --exclude-schema=realtime `
  --exclude-schema=supabase_functions

"@
        Write-Host $pgDumpExample -ForegroundColor Gray
    }
    
    "manual" {
        Write-Host "`n🔧 Instruções para backup manual..." -ForegroundColor Blue
        $manualInstructions = @"

📋 BACKUP MANUAL VIA SUPABASE DASHBOARD:

1. 🌐 Acesse: https://supabase.com/dashboard/project/$PROJECT_ID
2. 🔧 Vá em "Settings" > "Database"
3. 📊 Clique em "Database" no menu lateral
4. 💾 Procure por "Backup" ou "Export"
5. 📥 Baixe o backup

📋 BACKUP MANUAL VIA SQL EDITOR:

1. 🌐 Acesse: https://supabase.com/dashboard/project/$PROJECT_ID/sql
2. 📝 Execute os comandos SQL abaixo para exportar dados:

-- Backup da tabela instrutores_webapp
COPY (SELECT * FROM instrutores_webapp) TO STDOUT WITH CSV HEADER;

-- Backup da tabela cobrancas  
COPY (SELECT * FROM cobrancas) TO STDOUT WITH CSV HEADER;

3. 💾 Salve o resultado em arquivos .csv

📋 ESTRUTURA DAS TABELAS:
- instrutores_webapp (usuários/instrutores)
- cobrancas (cobranças criadas)

"@
        Write-Host $manualInstructions -ForegroundColor Gray
    }
}

Write-Host "`n📁 Conteúdo do diretório de backup:" -ForegroundColor Cyan
if (Test-Path $OutputDir) {
    Get-ChildItem $OutputDir | ForEach-Object {
        $size = if ($_.Length) { "$([math]::Round($_.Length / 1KB, 2)) KB" } else { "DIR" }
        Write-Host "  📄 $($_.Name) - $size" -ForegroundColor Gray
    }
} else {
    Write-Host "  (vazio)" -ForegroundColor Gray
}

Write-Host "`n🎯 Backup concluído!" -ForegroundColor Green
Write-Host "💡 Dica: Guarde este backup em local seguro (Google Drive, Dropbox, etc.)" -ForegroundColor Yellow
