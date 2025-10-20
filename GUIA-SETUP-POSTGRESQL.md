# Guia de Setup - PostgreSQL Local

## Pré-requisitos
- PostgreSQL instalado e rodando
- Node.js instalado (v18 ou superior)
- npm ou yarn

## 1. Configurar o Banco de Dados PostgreSQL

### 1.1. Criar o banco de dados
```bash
# Acessar o PostgreSQL (usuário postgres, senha: nexla)
psql -U postgres

# Criar o banco de dados
CREATE DATABASE nexla_acesso;

# Sair do psql
\q
```

### 1.2. Executar o script de setup
```bash
# Executar o script SQL completo
psql -U postgres -d nexla_acesso -f backend/setup-database.sql
```

**OU** execute manualmente as queries do arquivo `backend/setup-database.sql` no seu cliente PostgreSQL favorito (pgAdmin, DBeaver, etc.)

## 2. Configurar o Backend

### 2.1. Verificar arquivo .env
O arquivo `backend/.env` já está configurado com:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=nexla
DB_DATABASE=nexla_acesso
```

### 2.2. Instalar dependências e rodar o backend
```bash
cd backend
npm install
npm run start:dev
```

O backend estará rodando em: **http://localhost:3001**

## 3. Configurar o Frontend

### 3.1. Verificar arquivo .env
O arquivo `.env` na raiz do projeto já está configurado:
```
VITE_API_URL=http://localhost:3001/api
```

### 3.2. Instalar dependências e rodar o frontend
```bash
# Na raiz do projeto
npm install
npm run dev
```

O frontend estará rodando em: **http://localhost:5173**

## 4. Acessar o Sistema

### 4.1. Credenciais de Administrador Padrão
- **Email**: admin@sicoob.com.br
- **Senha**: Admin@2024

⚠️ **IMPORTANTE**: Troque a senha imediatamente após o primeiro login!

## 5. Verificar se está funcionando

### 5.1. Testar conexão com o banco
```bash
cd backend
npm run test-db
```

### 5.2. Verificar logs do backend
O backend deve mostrar:
```
[Nest] INFO [TypeOrmModule] Database connected successfully
[Nest] INFO Application is running on: http://localhost:3001
```

## 6. Estrutura de Pastas

```
project/
├── backend/               # API NestJS
│   ├── src/
│   │   ├── auth/         # Autenticação JWT
│   │   ├── users/        # Gestão de usuários
│   │   ├── analysis-types/  # Tipos de análise
│   │   ├── documents/    # Upload e análise de documentos
│   │   ├── token-usage/  # Monitoramento de uso de tokens
│   │   └── entities/     # Entidades do TypeORM
│   ├── uploads/          # Arquivos enviados
│   └── .env              # Configurações do backend
│
├── src/                  # Frontend React
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   └── lib/
│       └── api.ts        # Cliente API
│
└── .env                  # Configurações do frontend
```

## 7. Troubleshooting

### Backend não conecta ao banco
```bash
# Verificar se o PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar se o banco existe
psql -U postgres -l | grep nexla_acesso

# Testar conexão manualmente
psql -U postgres -d nexla_acesso
```

### Erro de autenticação no PostgreSQL
Verifique o arquivo `pg_hba.conf` e garanta que tem a linha:
```
local   all   postgres   md5
```

### Porta 3001 ou 5173 já está em uso
Mude as portas nos arquivos de configuração:
- Backend: `backend/.env` → `PORT=3002`
- Frontend: `vite.config.ts` → adicione `server: { port: 5174 }`

## 8. Próximos Passos

1. ✅ Configure os tipos de análise através da interface
2. ✅ Crie usuários adicionais
3. ✅ Faça upload de documentos para teste
4. ✅ Configure a integração com a API de IA (se necessário)

## 9. Comandos Úteis

```bash
# Backend
cd backend
npm run start:dev      # Rodar em modo desenvolvimento
npm run build          # Build para produção
npm run start:prod     # Rodar em produção
npm run test-db        # Testar conexão com banco

# Frontend
npm run dev            # Rodar em desenvolvimento
npm run build          # Build para produção
npm run preview        # Preview da build

# Banco de dados
npm run migration:run     # Rodar migrations
npm run migration:revert  # Reverter última migration
```

## Suporte

Se encontrar problemas, verifique:
1. Logs do backend (`backend/`)
2. Console do navegador (F12)
3. Conexão com o banco de dados
4. Portas disponíveis (3001, 5173, 5432)
