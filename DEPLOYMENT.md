# 🚀 Guia de Deployment - Sicoob Análise de Documentos

## ✅ O que foi desenvolvido

✔️ Backend completo em NestJS com TypeORM
✔️ Autenticação JWT segura
✔️ Upload de arquivos local
✔️ Integração com n8n
✔️ Sistema de roles (Admin/User)
✔️ Migrations do banco de dados
✔️ API REST completa
✔️ Frontend com integração à nova API

## 📦 Estrutura do Projeto

```
project/
├── backend/              # Backend NestJS
│   ├── src/
│   │   ├── auth/        # Autenticação JWT
│   │   ├── users/       # Gerenciamento de usuários
│   │   ├── analysis-types/  # Tipos de análise
│   │   ├── documents/   # Upload e análise
│   │   ├── token-usage/ # Monitoramento
│   │   ├── entities/    # Entidades TypeORM
│   │   ├── migrations/  # Migrations do banco
│   │   └── main.ts      # Aplicação principal
│   ├── package.json
│   └── .env.example
├── src/                 # Frontend React
├── package.json
└── README.md
```

## 🔧 Configuração do PostgreSQL do Cliente

### Passo 1: Criar o Banco de Dados

O cliente deve executar no servidor PostgreSQL dele:

```sql
CREATE DATABASE sicoob_analysis;
```

### Passo 2: Configurar o `.env` do Backend

No arquivo `backend/.env`:

```env
# IMPORTANTE: Alterar com as credenciais do PostgreSQL do cliente
DB_HOST=ip_do_servidor_postgres
DB_PORT=5432
DB_USERNAME=usuario_postgres_do_cliente
DB_PASSWORD=senha_postgres_do_cliente
DB_DATABASE=sicoob_analysis

# Gerar chave secreta forte (ex: openssl rand -base64 32)
JWT_SECRET=chave_secreta_única_do_cliente

# Configurar URLs do ambiente do cliente
PORT=3001
BACKEND_URL=http://dominio-do-cliente.com.br:3001
FRONTEND_URL=http://dominio-do-cliente.com.br
```

### Passo 3: Executar Migrations

```bash
cd backend
npm install
npm run migration:run
```

Isso criará automaticamente todas as tabelas necessárias:
- `users` - Usuários do sistema
- `analysis_types` - Tipos de análise configuráveis
- `documents` - Documentos enviados
- `token_usage` - Monitoramento de tokens

### Passo 4: Criar Usuário Admin

```sql
-- Conectar no banco
\c sicoob_analysis

-- Criar primeiro admin
-- Senha padrão: Admin@2024
-- IMPORTANTE: Trocar após primeiro login!

INSERT INTO users (
  id,
  email,
  password,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@sicoob.com.br',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Administrador Sistema',
  'admin',
  NOW(),
  NOW()
);
```

## 🏃 Executar a Aplicação

### Desenvolvimento (para testes)

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd ..
npm run dev
```

### Produção

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd ..
npm run build
# Servir a pasta dist/ com nginx ou similar
```

## 🔐 Primeiro Acesso

1. Acessar o sistema no navegador
2. Fazer login com:
   - Email: `admin@sicoob.com.br`
   - Senha: `Admin@2024`
3. **IMEDIATAMENTE** trocar a senha
4. Criar tipos de análise
5. Criar usuários normais

## 📋 Checklist de Deploy

- [ ] PostgreSQL instalado e rodando
- [ ] Banco `sicoob_analysis` criado
- [ ] Arquivo `backend/.env` configurado com credenciais corretas
- [ ] Migrations executadas (`npm run migration:run`)
- [ ] Usuário admin criado no banco
- [ ] Backend buildado e rodando
- [ ] Frontend buildado
- [ ] Nginx/Apache configurado (se aplicável)
- [ ] CORS configurado corretamente
- [ ] Webhook n8n testado
- [ ] Primeiro login realizado com sucesso
- [ ] Senha admin alterada

## 🔍 Verificação

### Testar Backend

```bash
# Health check
curl http://localhost:3001/api/auth/login

# Deve retornar erro 400 (esperado sem credenciais)
```

### Testar Conexão com Banco

```bash
# No servidor PostgreSQL
psql -U usuario -d sicoob_analysis -c "\dt"

# Deve listar as tabelas: users, analysis_types, documents, token_usage
```

## ⚠️ Notas Importantes

1. **Segurança**:
   - Trocar JWT_SECRET para valor único
   - Trocar senha do admin após primeiro login
   - Manter `.env` fora do controle de versão
   - Configurar firewall adequadamente

2. **Backup**:
   - Fazer backup regular do PostgreSQL
   - Fazer backup da pasta `uploads/`

3. **Logs**:
   - Monitorar logs do backend
   - Configurar rotação de logs em produção

4. **Performance**:
   - Considerar usar PM2 para gerenciar o backend
   - Configurar limite de conexões do PostgreSQL
   - Monitorar uso de disco (uploads)

## 🆘 Problemas Comuns

### "Migration failed"
- Verificar se banco existe
- Verificar credenciais no `.env`
- Verificar se PostgreSQL está acessível

### "Cannot connect to database"
- Verificar se PostgreSQL está rodando
- Verificar firewall/portas
- Verificar permissões do usuário no banco

### "Unauthorized" no frontend
- Verificar se backend está rodando
- Verificar VITE_API_URL no `.env` do frontend
- Limpar localStorage do navegador

## 📞 Suporte Técnico

Em caso de dúvidas durante o deployment, documentar:
1. Mensagem de erro completa
2. Sistema operacional e versão
3. Versão do PostgreSQL
4. Logs do backend
5. Configuração do `.env` (SEM SENHAS!)
