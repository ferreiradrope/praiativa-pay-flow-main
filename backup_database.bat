@echo off
echo.
echo =====================================================
echo   BACKUP DO BANCO DE DADOS - PRAIATIVA PAY FLOW
echo =====================================================
echo.

set PROJECT_ID=nzvdcpzndkbjmojmqskg
set BACKUP_DIR=backups

if not exist %BACKUP_DIR% (
    mkdir %BACKUP_DIR%
    echo ✅ Diretorio de backup criado: %BACKUP_DIR%
)

echo 🚀 Iniciando backup do banco de dados...
echo 📅 Data/Hora: %date% %time%
echo 🆔 Project ID: %PROJECT_ID%
echo.

echo 🔧 Verificando Supabase CLI...
supabase --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Supabase CLI nao encontrado!
    echo.
    echo 📝 Para instalar:
    echo    npm install -g supabase
    echo.
    echo 🌐 Ou use backup manual:
    echo    https://supabase.com/dashboard/project/%PROJECT_ID%
    pause
    exit /b 1
)

echo ✅ Supabase CLI encontrado!
echo.

echo 🔑 Fazendo login no Supabase...
supabase login

echo.
echo 📥 Criando backup...

for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set BACKUP_FILE=%BACKUP_DIR%\praiativa_backup_%datetime:~0,8%_%datetime:~8,6%.sql

echo 🔄 Exportando para: %BACKUP_FILE%
supabase db dump --project-id %PROJECT_ID% --file "%BACKUP_FILE%"

if exist "%BACKUP_FILE%" (
    echo.
    echo ✅ Backup concluido com sucesso!
    echo 📁 Arquivo: %BACKUP_FILE%
    
    for %%A in ("%BACKUP_FILE%") do (
        set size=%%~zA
        set /a size_kb=!size!/1024
        echo 📊 Tamanho: !size_kb! KB
    )
) else (
    echo ❌ Erro ao criar backup!
)

echo.
echo 📁 Backups existentes:
dir /b %BACKUP_DIR%\*.sql

echo.
echo 🎯 Processo concluido!
echo 💡 Dica: Guarde este backup em local seguro
pause
