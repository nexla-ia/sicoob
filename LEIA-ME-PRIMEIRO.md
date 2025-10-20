# 👋 BEM-VINDO - Sicoob Análise de Documentos

## 🎯 Por onde começar?

Se você está vendo este projeto pela primeira vez, siga esta ordem:

### 1️⃣ **INICIO-RAPIDO.txt** ⭐
**Comece por aqui!** Guia visual de 3 passos para ter o sistema rodando em minutos.

### 2️⃣ **INSTALACAO-RAPIDA.md**
Instruções detalhadas passo a passo para configuração inicial.

### 3️⃣ **README.md**
Documentação geral do projeto, arquitetura e uso.

### 4️⃣ **COMANDOS-UTEIS.md**
Referência rápida de todos os comandos que você vai precisar.

---

## 📚 Todos os Arquivos de Documentação

### 🚀 Para Começar
| Arquivo | Descrição |
|---------|-----------|
| **INICIO-RAPIDO.txt** | 👈 **COMECE AQUI!** Guia visual de 3 passos |
| **INSTALACAO-RAPIDA.md** | Guia passo a passo detalhado |
| **LEIA-ME-PRIMEIRO.md** | Este arquivo - índice da documentação |

### 📖 Documentação Geral
| Arquivo | Descrição |
|---------|-----------|
| **README.md** | Documentação completa do projeto |
| **RESUMO-PROJETO.md** | Resumo executivo do que foi desenvolvido |
| **DEPLOYMENT.md** | Guia completo de deploy em produção |

### 🛠️ Referências Técnicas
| Arquivo | Descrição |
|---------|-----------|
| **COMANDOS-UTEIS.md** | Lista de comandos úteis para o dia a dia |
| **backend/setup-database.sql** | Script SQL para criar tabelas |
| **backend/test-connection.js** | Script para testar conexão com banco |

### ⚙️ Configuração
| Arquivo | Descrição |
|---------|-----------|
| **backend/.env** | ✅ Configuração do backend (já criado!) |
| **backend/.env.example** | Template de configuração backend |
| **.env** | ✅ Configuração do frontend (já criado!) |
| **.env.example** | Template de configuração frontend |

---

## 🎯 Guia Rápido por Perfil

### 👨‍💻 Desenvolvedor (Primeira Instalação)
```
1. INICIO-RAPIDO.txt          ← Comece aqui!
2. INSTALACAO-RAPIDA.md       ← Para mais detalhes
3. COMANDOS-UTEIS.md          ← Para referência
```

### 🔧 DevOps (Deploy em Produção)
```
1. DEPLOYMENT.md              ← Guia completo de deploy
2. README.md                  ← Arquitetura e requisitos
3. COMANDOS-UTEIS.md          ← Manutenção e troubleshooting
```

### 📊 Gestor/Analista (Entender o Projeto)
```
1. RESUMO-PROJETO.md          ← Visão geral executiva
2. README.md                  ← Detalhes técnicos
3. DEPLOYMENT.md              ← Requisitos de infraestrutura
```

---

## ⚡ Início Ultra Rápido (TL;DR)

Se você tem PostgreSQL rodando e só quer ver funcionando:

```bash
# 1. Criar tabelas
psql -U postgres -d nexla_acesso -f backend/setup-database.sql

# 2. Iniciar backend (terminal 1)
cd backend && npm run start:dev

# 3. Iniciar frontend (terminal 2)
npm run dev

# 4. Acessar http://localhost:5173
# Login: admin@sicoob.com.br / Admin@2024
```

---

## 🗂️ Estrutura do Projeto

```
project/
│
├── 📄 INICIO-RAPIDO.txt          ⭐ COMECE AQUI!
├── 📄 LEIA-ME-PRIMEIRO.md        ← Você está aqui
├── 📄 INSTALACAO-RAPIDA.md
├── 📄 README.md
├── 📄 RESUMO-PROJETO.md
├── 📄 DEPLOYMENT.md
├── 📄 COMANDOS-UTEIS.md
│
├── 📁 backend/                   → Backend NestJS
│   ├── src/                      → Código fonte
│   ├── .env                      ✅ Configurado
│   ├── setup-database.sql        → Script SQL
│   └── test-connection.js        → Teste de conexão
│
├── 📁 src/                       → Frontend React
│   ├── components/
│   ├── pages/
│   └── lib/
│
└── .env                          ✅ Configurado
```

---

## ✅ Status do Projeto

| Item | Status |
|------|--------|
| Backend NestJS | ✅ Completo |
| Frontend React | ✅ Completo |
| Banco de Dados | ✅ Configurado |
| Migrations SQL | ✅ Prontas |
| Autenticação JWT | ✅ Implementada |
| Upload de Arquivos | ✅ Funcional |
| Integração n8n | ✅ Pronta |
| Documentação | ✅ Completa |
| Testes de Build | ✅ Aprovado |

**Status Geral:** 🎉 **PROJETO 100% PRONTO PARA USO!**

---

## 🆘 Precisa de Ajuda?

### Problema com Instalação?
→ Leia **INSTALACAO-RAPIDA.md** seção "Problemas Comuns"

### Problema com Banco de Dados?
→ Leia **COMANDOS-UTEIS.md** seção "Troubleshooting"

### Dúvidas sobre Deploy?
→ Leia **DEPLOYMENT.md** seção "Problemas Comuns"

### Esqueceu algum comando?
→ Leia **COMANDOS-UTEIS.md**

---

## 📋 Checklist Inicial

Antes de começar, certifique-se de ter:

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL rodando
- [ ] Banco `nexla_acesso` criado
- [ ] Credenciais do banco anotadas
- [ ] Acesso ao terminal/linha de comando

**Tudo pronto?** → Abra **INICIO-RAPIDO.txt** e comece! 🚀

---

## 🎯 Objetivo do Sistema

Sistema interno do Sicoob para análise automatizada de documentos usando IA, integrando:
- Upload de documentos
- Processamento via n8n
- Análise por modelos de IA (GPT-4, Claude, etc)
- Monitoramento de custos e tokens
- Gestão de usuários e permissões

---

## 🔐 Credenciais Padrão

**Banco PostgreSQL:**
- Database: `nexla_acesso`
- User: `postgres`
- Password: `nexla`

**Sistema (Primeiro Login):**
- Email: `admin@sicoob.com.br`
- Senha: `Admin@2024`
- ⚠️ **TROCAR após primeiro acesso!**

---

## 🎨 Tecnologias

- **Backend:** NestJS 10 + TypeORM + PostgreSQL
- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS
- **Integração:** n8n Webhook
- **Autenticação:** JWT + Bcrypt

---

**Boa sorte e bom desenvolvimento! 🚀**

*Desenvolvido para Sicoob Região Norte do Brasil*
