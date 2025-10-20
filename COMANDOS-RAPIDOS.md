# 🚀 COMANDOS RÁPIDOS - Copiar e Colar

## 1️⃣ Setup Inicial do Banco (executar UMA VEZ)

```bash
# Criar banco de dados
psql -U postgres -c "CREATE DATABASE nexla_acesso;"

# Executar script SQL
psql -U postgres -d nexla_acesso -f backend/setup-database.sql
```

## 2️⃣ Instalar Dependências (executar UMA VEZ)

```bash
# Backend
cd backend && npm install && cd ..

# Frontend
npm install
```

## 3️⃣ Rodar a Aplicação (SEMPRE)

### Opção A - Dois terminais

**Terminal 1 - Backend:**
```bash
cd backend && npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Opção B - Background (Linux/Mac)

```bash
# Rodar backend em background
cd backend && npm run start:dev > backend.log 2>&1 &

# Voltar e rodar frontend
cd .. && npm run dev
```

## 4️⃣ Testar se está funcionando

```bash
# Testar conexão com banco
cd backend && npm run test-db

# Testar backend API
curl http://localhost:3001/api/auth/profile

# Abrir frontend no navegador
open http://localhost:5173  # Mac
xdg-open http://localhost:5173  # Linux
start http://localhost:5173  # Windows
```

## 5️⃣ Parar a Aplicação

```bash
# Ctrl+C em cada terminal

# OU se rodou em background:
pkill -f "npm run start:dev"
pkill -f "npm run dev"
```

## 6️⃣ Resetar Banco de Dados (se necessário)

```bash
# CUIDADO: Isso apaga todos os dados!
psql -U postgres -c "DROP DATABASE nexla_acesso;"
psql -U postgres -c "CREATE DATABASE nexla_acesso;"
psql -U postgres -d nexla_acesso -f backend/setup-database.sql
```

## 7️⃣ Ver Logs

```bash
# Backend (se rodou em background)
tail -f backend/backend.log

# Ver usuários no banco
psql -U postgres -d nexla_acesso -c "SELECT email, role, created_at FROM users;"

# Ver tabelas
psql -U postgres -d nexla_acesso -c "\dt"
```

## 8️⃣ Build para Produção

```bash
# Backend
cd backend && npm run build && npm run start:prod

# Frontend
npm run build && npm run preview
```

## 📝 Credenciais Padrão

```
Banco de dados:
  Host: localhost
  Port: 5432
  Database: nexla_acesso
  User: postgres
  Password: nexla

Login Admin:
  Email: admin@sicoob.com.br
  Senha: Admin@2024

URLs:
  Frontend: http://localhost:5173
  Backend API: http://localhost:3001/api
```

## 🔥 Comando All-in-One (Setup Completo)

```bash
# Copie e cole tudo de uma vez (Linux/Mac):
psql -U postgres -c "CREATE DATABASE nexla_acesso;" && \
psql -U postgres -d nexla_acesso -f backend/setup-database.sql && \
cd backend && npm install && cd .. && npm install && \
echo "✅ Setup completo! Agora rode:" && \
echo "   Terminal 1: cd backend && npm run start:dev" && \
echo "   Terminal 2: npm run dev"
```

## 💡 Atalhos Úteis

```bash
# Ver processos rodando nas portas
lsof -i :3001  # Backend
lsof -i :5173  # Frontend
lsof -i :5432  # PostgreSQL

# Matar processo em uma porta específica
kill -9 $(lsof -ti:3001)

# Verificar status PostgreSQL
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # Mac

# Acessar banco direto
psql -U postgres -d nexla_acesso
```

---

**Pronto para começar! 🎉**
