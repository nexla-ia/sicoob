# 🚀 Instalação Rápida - Sicoob Análise de Documentos

## ✅ Seu Banco PostgreSQL já está configurado!

**Banco:** `nexla_acesso`
**Usuário:** `postgres`
**Senha:** `nexla`

## 📋 Passo a Passo

### 1️⃣ Criar as Tabelas no PostgreSQL

Execute o script SQL fornecido:

```bash
psql -U postgres -d nexla_acesso -f backend/setup-database.sql
```

Ou copie e cole o conteúdo de `backend/setup-database.sql` no pgAdmin ou DBeaver.

**O script vai criar:**
- ✅ 4 tabelas (users, analysis_types, documents, token_usage)
- ✅ Índices para performance
- ✅ Triggers automáticos
- ✅ Usuário admin inicial

### 2️⃣ Verificar Usuário Admin Criado

```sql
SELECT email, full_name, role FROM users WHERE role = 'admin';
```

Deve retornar:
- Email: `admin@sicoob.com.br`
- Senha: `Admin@2024`

### 3️⃣ Iniciar o Backend

```bash
cd backend
npm run start:dev
```

Você verá:
```
🚀 Backend rodando em http://localhost:3001
📁 Uploads em http://localhost:3001/uploads
🔗 API em http://localhost:3001/api
```

### 4️⃣ Iniciar o Frontend

Em outro terminal:

```bash
npm run dev
```

Você verá:
```
  ➜  Local:   http://localhost:5173/
```

### 5️⃣ Fazer Login

1. Abra o navegador em `http://localhost:5173`
2. Faça login:
   - Email: `admin@sicoob.com.br`
   - Senha: `Admin@2024`
3. **IMPORTANTE:** Troque a senha imediatamente!

## 🎯 Primeiros Passos no Sistema

### Como Admin:

1. **Criar Tipos de Análise**
   - Ir em "Tipos de Análise"
   - Clicar em "Novo"
   - Configurar nome, modelo de IA e template

2. **Criar Usuários**
   - Ir em "Usuários"
   - Clicar em "Novo"
   - Informar dados do usuário

3. **Monitorar Uso**
   - Ir em "Uso de Tokens"
   - Ver estatísticas e custos

### Como Usuário:

1. **Fazer Análise**
   - Ir em "Análise"
   - Selecionar tipo de análise
   - Fazer upload do documento
   - Aguardar resultado

## 🔍 Verificar se está Funcionando

### Testar Backend

```bash
curl http://localhost:3001/api/auth/login
```

Deve retornar erro 400 (esperado, sem credenciais)

### Testar Banco de Dados

```sql
-- Ver tabelas criadas
\dt

-- Ver usuários
SELECT * FROM users;
```

## ⚠️ Problemas Comuns

### Backend não inicia
- Verificar se PostgreSQL está rodando
- Verificar credenciais no `backend/.env`
- Ver logs de erro no terminal

### Não consegue fazer login
- Verificar se o usuário admin foi criado no banco
- Verificar se backend está rodando
- Limpar cache do navegador (F12 > Application > Clear Storage)

### Erro de CORS
- Verificar se FRONTEND_URL está correto no `backend/.env`
- Verificar se VITE_API_URL está correto no `.env`

## 📞 Suporte

Se precisar de ajuda:
1. Verificar os logs do backend no terminal
2. Abrir o console do navegador (F12)
3. Verificar se todas as tabelas foram criadas no banco

## 🎉 Pronto!

Seu sistema está rodando e pronto para uso!

**Próximos Passos:**
- Criar tipos de análise personalizados
- Criar usuários da equipe
- Configurar webhook do n8n (se ainda não configurado)
- Fazer primeira análise de teste
