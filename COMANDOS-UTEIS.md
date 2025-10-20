# 🛠️ Comandos Úteis - Sicoob Análise

## 🚀 Inicialização

### Primeira vez (Setup completo)

```bash
# 1. Criar banco de dados
psql -U postgres -d nexla_acesso -f backend/setup-database.sql

# 2. Testar conexão
cd backend
npm run test-db

# 3. Iniciar backend (terminal 1)
npm run start:dev

# 4. Iniciar frontend (terminal 2)
cd ..
npm run dev
```

### Próximas vezes

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
npm run dev
```

## 🗄️ PostgreSQL

### Conectar no banco

```bash
psql -U postgres -d nexla_acesso
```

### Ver tabelas

```sql
\dt
```

### Ver usuários do sistema

```sql
SELECT id, email, full_name, role, created_at
FROM users
ORDER BY created_at DESC;
```

### Ver tipos de análise

```sql
SELECT id, name, ai_model, is_active
FROM analysis_types
ORDER BY created_at DESC;
```

### Ver documentos

```sql
SELECT id, file_name, status, created_at
FROM documents
ORDER BY created_at DESC
LIMIT 10;
```

### Ver uso de tokens

```sql
SELECT
  u.full_name,
  COUNT(*) as total_analises,
  SUM(tu.tokens_used) as total_tokens,
  SUM(tu.cost) as custo_total
FROM token_usage tu
JOIN users u ON u.id = tu.user_id
GROUP BY u.full_name
ORDER BY total_tokens DESC;
```

### Resetar senha de um usuário

```sql
-- Senha: NovaSenh@123
UPDATE users
SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'email@exemplo.com';
```

### Tornar usuário admin

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'email@exemplo.com';
```

### Limpar dados de teste

```sql
-- CUIDADO! Isso apaga TODOS os dados
TRUNCATE TABLE token_usage CASCADE;
TRUNCATE TABLE documents CASCADE;
TRUNCATE TABLE analysis_types CASCADE;
-- Não apagar users se quiser manter os usuários
```

## 📦 Backend (NestJS)

### Desenvolvimento

```bash
cd backend

# Iniciar em modo watch
npm run start:dev

# Build para produção
npm run build

# Rodar produção
npm run start:prod

# Testar conexão com banco
npm run test-db
```

### Migrations

```bash
# Gerar nova migration (automática)
npm run migration:generate -- src/migrations/NomeDaMigration

# Executar migrations pendentes
npm run migration:run

# Reverter última migration
npm run migration:revert
```

## 🎨 Frontend (React)

### Desenvolvimento

```bash
# Iniciar dev server
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Verificar tipos TypeScript
npm run typecheck

# Lint
npm run lint
```

## 🐛 Debug e Logs

### Ver logs do backend

```bash
# Se usando PM2
pm2 logs sicoob-backend

# Desenvolvimento (logs aparecem no terminal)
npm run start:dev
```

### Ver erros do PostgreSQL

```bash
# Linux
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# macOS (Homebrew)
tail -f /usr/local/var/log/postgresql@14.log
```

### Testar endpoints manualmente

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sicoob.com.br","password":"Admin@2024"}'

# Listar tipos de análise (precisa do token)
curl http://localhost:3001/api/analysis-types \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Health check
curl http://localhost:3001/api/auth/profile
```

## 🔒 Segurança

### Gerar nova chave JWT

```bash
# Linux/macOS
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Gerar hash de senha (bcrypt)

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('SuaSenha', 10, (e,h) => console.log(h))"
```

## 📊 Monitoramento

### Ver processos rodando

```bash
# Se usando PM2
pm2 status
pm2 monit

# Processos Node.js
ps aux | grep node
```

### Ver uso de disco (uploads)

```bash
du -sh backend/uploads/*
```

### Ver conexões ativas no PostgreSQL

```sql
SELECT
  count(*) as conexoes_ativas,
  datname,
  usename
FROM pg_stat_activity
WHERE state = 'active'
GROUP BY datname, usename;
```

## 🧹 Manutenção

### Limpar node_modules

```bash
# Backend
rm -rf backend/node_modules
cd backend && npm install

# Frontend
rm -rf node_modules
npm install
```

### Limpar uploads antigos (exemplo: mais de 30 dias)

```bash
find backend/uploads -type f -mtime +30 -delete
```

### Backup do banco

```bash
# Backup completo
pg_dump -U postgres nexla_acesso > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup só da estrutura
pg_dump -U postgres --schema-only nexla_acesso > schema_backup.sql

# Backup só dos dados
pg_dump -U postgres --data-only nexla_acesso > data_backup.sql
```

### Restaurar backup

```bash
psql -U postgres -d nexla_acesso < backup_20241015_120000.sql
```

## 🔄 Atualização

### Atualizar dependências

```bash
# Backend
cd backend
npm update

# Frontend
cd ..
npm update
```

### Verificar dependências desatualizadas

```bash
npm outdated
```

## 🚀 Deploy (Produção)

### PM2 (Recomendado)

```bash
# Instalar PM2
npm install -g pm2

# Backend
cd backend
npm run build
pm2 start dist/main.js --name sicoob-backend
pm2 save
pm2 startup

# Ver logs
pm2 logs sicoob-backend

# Restart
pm2 restart sicoob-backend

# Stop
pm2 stop sicoob-backend
```

### Nginx (Frontend)

```bash
# Build
npm run build

# Copiar arquivos
sudo cp -r dist/* /var/www/sicoob/

# Restart nginx
sudo systemctl restart nginx
```

## 🆘 Troubleshooting

### Backend não inicia

```bash
# Verificar se porta 3001 está em uso
lsof -i :3001
# ou
netstat -tulpn | grep 3001

# Matar processo na porta
kill -9 $(lsof -t -i:3001)
```

### PostgreSQL não conecta

```bash
# Ver status
sudo systemctl status postgresql

# Iniciar
sudo systemctl start postgresql

# Habilitar no boot
sudo systemctl enable postgresql

# Verificar se aceita conexões
psql -U postgres -c "SELECT 1"
```

### Erro de permissão uploads

```bash
# Criar pasta uploads
mkdir -p backend/uploads

# Dar permissão
chmod 755 backend/uploads
```

### Frontend não conecta no backend

```bash
# Verificar .env
cat .env
# Deve ter: VITE_API_URL=http://localhost:3001/api

# Limpar cache do navegador
# Chrome: F12 > Application > Clear Storage > Clear site data
```

## 📝 Queries Úteis

### Dashboard rápido

```sql
-- Resumo geral
SELECT
  'Total Usuários' as metrica,
  COUNT(*)::text as valor
FROM users
UNION ALL
SELECT
  'Usuários Admin',
  COUNT(*)::text
FROM users
WHERE role = 'admin'
UNION ALL
SELECT
  'Tipos de Análise',
  COUNT(*)::text
FROM analysis_types
WHERE is_active = true
UNION ALL
SELECT
  'Documentos Processados',
  COUNT(*)::text
FROM documents
WHERE status = 'completed'
UNION ALL
SELECT
  'Total Tokens Usados',
  SUM(tokens_used)::text
FROM token_usage;
```

### Top 5 usuários que mais usam

```sql
SELECT
  u.full_name,
  u.email,
  COUNT(d.id) as analises,
  COALESCE(SUM(tu.tokens_used), 0) as tokens,
  COALESCE(SUM(tu.cost), 0) as custo
FROM users u
LEFT JOIN documents d ON d.user_id = u.id
LEFT JOIN token_usage tu ON tu.user_id = u.id
GROUP BY u.id, u.full_name, u.email
ORDER BY tokens DESC
LIMIT 5;
```

---

**💡 Dica**: Salve este arquivo nos favoritos do seu navegador ou editor para referência rápida!
