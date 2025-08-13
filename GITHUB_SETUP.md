# 🚀 Como publicar no GitHub

## Preparação Local ✅
- [x] Git inicializado
- [x] Arquivos commitados
- [x] README.md atualizado
- [x] .gitignore configurado

## Próximos passos:

### 1. Criar repositório no GitHub
1. Acesse https://github.com/new
2. Nome sugerido: `praiativa-pay-flow`
3. Descrição: `Sistema de gestão de cobranças para instrutores de atividades aquáticas`
4. **Público** ou Privado (sua escolha)
5. **NÃO** inicialize com README, .gitignore ou licença (já temos)
6. Clique em **Create repository**

### 2. Conectar repositório local ao GitHub
No terminal (na pasta do projeto), execute:

```bash
# Adicionar origin (substitua SEU_USUARIO pelo seu GitHub username)
git remote add origin https://github.com/SEU_USUARIO/praiativa-pay-flow.git

# Renomear branch para main (padrão do GitHub)
git branch -M main

# Primeiro push
git push -u origin main
```

### 3. Configurar GitHub Pages (opcional)
Se quiser hospedar gratuitamente:
1. No repositório, vá em **Settings**
2. **Pages** no menu lateral
3. Source: **GitHub Actions**
4. Selecione **Static HTML** ou configure Vite deploy

### 4. Comandos alternativos se houver problemas:

#### Se não conseguir push (repositório não vazio):
```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

#### Se quiser verificar status:
```bash
git status
git remote -v
git log --oneline
```

### 5. Próximas features (sugestões):
- [ ] Configurar CI/CD com GitHub Actions
- [ ] Deploy automático no Vercel/Netlify
- [ ] Adicionar testes unitários
- [ ] Documentação da API
- [ ] Docker setup
- [ ] Monitoramento e analytics

### 6. URL final esperada:
`https://github.com/SEU_USUARIO/praiativa-pay-flow`

---

**Dica**: Depois de criar, você pode clonar em outras máquinas com:
```bash
git clone https://github.com/SEU_USUARIO/praiativa-pay-flow.git
```
