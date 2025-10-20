# ✅ SETUP COMPLETO - PostgreSQL Configurado

## 🎯 Resumo da Configuração

O projeto foi completamente configurado para usar **PostgreSQL local** ao invés do Supabase.

### Credenciais do Banco (já configuradas):
```
Host: localhost
Port: 5432
Database: nexla_acesso
Username: postgres
Password: nexla
```

## 📋 Checklist - O que foi feito

### ✅ Backend (NestJS + TypeORM + PostgreSQL)
- [x] Arquivo `.env` criado com credenciais corretas
- [x] TypeORM configurado para PostgreSQL
- [x] Dependências instaladas (510 packages)
- [x] Build compilado com sucesso
- [x] Script SQL de setup completo disponível
- [x] Script de teste de conexão disponível

### ✅ Frontend (React + Vite)
- [x] API client configurado para http://localhost:3001/api
- [x] Arquivo `.env` atualizado
- [x] Removidas dependências do Supabase (continuam instaladas mas não são usadas)

### ✅ Documentação
- [x] Guia completo de setup criado (`GUIA-SETUP-POSTGRESQL.md`)
- [x] Script SQL com todas as tabelas (`backend/setup-database.sql`)
- [x] Script de teste de conexão (`backend/test-connection.js`)

## 🚀 COMO RODAR NO SEU AMBIENTE

### Passo 1: Criar o banco de dados
```bash
# Acessar PostgreSQL
psql -U postgres

# Criar o banco
CREATE DATABASE nexla_acesso;
\q
```

### Passo 2: Executar o script SQL
```bash
# Opção 1: Via terminal
psql -U postgres -d nexla_acesso -f backend/setup-database.sql

# Opção 2: Copiar e colar o conteúdo do arquivo backend/setup-database.sql
# no seu cliente PostgreSQL (pgAdmin, DBeaver, etc.)
```

### Passo 3: Rodar o Backend
```bash
cd backend
npm install        # Se ainda não instalou
npm run test-db    # Testar conexão (opcional)
npm run start:dev  # Iniciar backend
```

✅ Backend rodando em: **http://localhost:3001**

### Passo 4: Rodar o Frontend
```bash
# Na raiz do projeto
npm install        # Se ainda não instalou
npm run dev        # Iniciar frontend
```

✅ Frontend rodando em: **http://localhost:5173**

## 🔐 Login Inicial

Após executar o script SQL, você terá um usuário admin criado:

- **Email**: admin@sicoob.com.br
- **Senha**: Admin@2024

⚠️ **TROQUE A SENHA** após o primeiro login!

## 📊 Estrutura do Banco de Dados

O script SQL cria automaticamente:

1. **users** - Gerenciamento de usuários (admin/user)
2. **analysis_types** - Tipos de análise com templates de IA
3. **documents** - Documentos enviados e análises
4. **token_usage** - Monitoramento de uso de tokens/custos

Além de:
- Índices para performance
- Triggers para atualização automática de timestamps
- Foreign keys e constraints
- Usuário admin inicial

## 🔍 Verificar se está tudo funcionando

### 1. Testar conexão com o banco
```bash
cd backend
npm run test-db
```

Você deve ver:
```
✅ Conexão estabelecida com sucesso!
📋 Tabelas existentes:
  ✓ analysis_types
  ✓ documents
  ✓ token_usage
  ✓ users
👤 Usuários admin: 1
✅ Tudo pronto para iniciar o backend!
```

### 2. Verificar logs do backend
Ao rodar `npm run start:dev`, você deve ver:
```
[TypeOrmModule] Database connected successfully
[NestApplication] Nest application successfully started
Application is running on: http://localhost:3001
```

### 3. Acessar o frontend
Abra http://localhost:5173 e faça login com as credenciais admin.

## 📁 Arquivos Importantes

```
project/
├── backend/
│   ├── .env                        # ✅ Configurado com credenciais PostgreSQL
│   ├── setup-database.sql          # ✅ Script completo de setup
│   ├── test-connection.js          # ✅ Script de teste
│   └── src/
│       ├── config/data-source.ts   # ✅ TypeORM configurado
│       └── entities/               # ✅ 4 entidades (User, AnalysisType, Document, TokenUsage)
│
├── .env                            # ✅ Frontend configurado para API local
└── src/lib/api.ts                  # ✅ Cliente API para backend
```

## 🆘 Problemas Comuns

### "Connection refused" ao testar conexão
**Solução**: PostgreSQL não está rodando
```bash
# Linux/Mac
sudo systemctl start postgresql
# ou
sudo service postgresql start

# Windows
# Iniciar PostgreSQL pelo Services
```

### "Database does not exist"
**Solução**: Criar o banco manualmente
```bash
psql -U postgres
CREATE DATABASE nexla_acesso;
\q
```

### "Authentication failed"
**Solução**: Verificar senha no arquivo `backend/.env`

### Porta 3001 já em uso
**Solução**: Mudar porta no `backend/.env`
```
PORT=3002
```

## 📞 Próximos Passos

1. Execute o setup do banco de dados no seu PostgreSQL local
2. Rode o backend: `cd backend && npm run start:dev`
3. Rode o frontend: `npm run dev`
4. Acesse http://localhost:5173 e faça login
5. Configure os tipos de análise
6. Faça upload de documentos para testar

## 💡 Dica Pro

Para rodar tudo de uma vez, você pode usar dois terminais:

**Terminal 1 (Backend):**
```bash
cd backend && npm run start:dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

---

**Tudo está pronto! Agora é só executar os comandos no seu ambiente local. 🚀**
