# Sicoob - Plataforma de Análise de Documentos

Plataforma interna do Sicoob para análise automatizada de documentos usando IA, desenvolvida para acelerar o processo de análise documental da instituição financeira.

## 🏗️ Arquitetura

**Frontend:** React + TypeScript + Vite + TailwindCSS
**Backend:** NestJS + TypeORM + PostgreSQL
**Integração:** n8n via webhook

## 📋 Pré-requisitos

- Node.js 18+ e npm
- PostgreSQL 14+
- Servidor n8n configurado

## 🚀 Instalação e Deploy

### 1. Configurar Banco de Dados PostgreSQL

```bash
# Criar banco de dados
createdb sicoob_analysis

# Ou via psql
psql -U postgres
CREATE DATABASE sicoob_analysis;
```

### 2. Configurar Backend (NestJS)

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_postgres
DB_DATABASE=sicoob_analysis

# JWT Configuration
JWT_SECRET=gere_uma_chave_secreta_forte_aqui
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=3001
NODE_ENV=production
BACKEND_URL=http://seu-servidor.com.br:3001

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# CORS
FRONTEND_URL=http://seu-frontend.com.br
```

```bash
# Executar migrations
npm run migration:run

# Build do backend
npm run build

# Iniciar em produção
npm run start:prod
```

### 3. Criar Usuário Admin Inicial

Execute no PostgreSQL:

```sql
-- Gerar hash da senha (use bcrypt com 10 rounds)
-- Senha exemplo: Admin@2024
-- Hash: $2b$10$YourHashHere

INSERT INTO users (email, password, full_name, role)
VALUES (
  'admin@sicoob.com.br',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Administrador Sistema',
  'admin'
);
```

### 4. Configurar Frontend

```bash
cd ..  # voltar para raiz do projeto

# Instalar dependências
npm install

# Configurar variáveis de ambiente
```

Crie `.env` na raiz:

```env
VITE_API_URL=http://seu-servidor.com.br:3001/api
```

```bash
# Build do frontend
npm run build

# Os arquivos estarão em dist/
```

### 5. Deploy em Produção

#### Opção A: Nginx + PM2

**Backend com PM2:**

```bash
cd backend
npm install -g pm2
pm2 start dist/main.js --name sicoob-backend
pm2 save
pm2 startup
```

**Frontend com Nginx:**

```nginx
server {
    listen 80;
    server_name seu-dominio.com.br;

    root /var/www/sicoob-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy para backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy para uploads
    location /uploads {
        proxy_pass http://localhost:3001;
    }
}
```

#### Opção B: Docker

Crie `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: sicoob_analysis
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: sua_senha
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: postgres
      DB_PASSWORD: sua_senha
      DB_DATABASE: sicoob_analysis
      JWT_SECRET: sua_chave_secreta
      NODE_ENV: production
    depends_on:
      - postgres
    volumes:
      - ./uploads:/app/uploads

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## 📱 Uso da Plataforma

### Para Administradores:

1. **Tipos de Análise**: Criar e configurar tipos de análise com templates de IA
2. **Usuários**: Gerenciar usuários do sistema
3. **Tokens**: Monitorar consumo e custos de tokens de IA

### Para Usuários:

1. **Análise**: Fazer upload de documentos e receber análises automáticas
2. **Histórico**: Visualizar análises anteriores

## 🔒 Segurança

- Autenticação JWT
- Senhas criptografadas com bcrypt
- Validação de tipos de arquivo
- Limite de tamanho de arquivo (10MB)
- Role-based access control (Admin/User)

## 🎨 Cores do Sicoob

| Cor                | Hex       | Uso                      |
|--------------------|-----------|--------------------------|
| Verde Principal    | `#006633` | Botões, destaque         |
| Verde Secundário   | `#00A859` | Hover, complementar      |
| Azul Petróleo      | `#004C45` | Fundo escuro, contrastes |
| Amarelo-Lima       | `#BFD730` | Destaques, atenção       |
| Cinza Neutro       | `#E5E5E5` | Fundos secundários       |
| Cinza Escuro       | `#333333` | Textos principais        |

## 🔧 Manutenção

### Backup do Banco

```bash
pg_dump -U postgres sicoob_analysis > backup_$(date +%Y%m%d).sql
```

### Atualizar Sistema

```bash
# Backend
cd backend
git pull
npm install
npm run build
pm2 restart sicoob-backend

# Frontend
cd ..
git pull
npm install
npm run build
# Copiar dist/ para servidor web
```

## 📊 Monitoramento

### Logs do Backend

```bash
pm2 logs sicoob-backend
```

### Verificar Status

```bash
pm2 status
```

## 🐛 Troubleshooting

### Erro de conexão com banco

- Verificar se PostgreSQL está rodando
- Conferir credenciais no `.env`
- Verificar firewall/portas

### Erro 401 (Unauthorized)

- Verificar se JWT_SECRET é o mesmo no backend
- Limpar localStorage do navegador
- Fazer login novamente

### Upload de arquivo falha

- Verificar permissões da pasta `uploads/`
- Verificar UPLOAD_DIR no `.env`
- Verificar tamanho do arquivo (máx 10MB)

## 📞 Suporte

Para suporte interno, contate a equipe de TI do Sicoob.

## 📄 Licença

Uso interno - Sicoob Região Norte do Brasil
