# 🚀 Sistema de Controle de Ponto - DevWeb1

Sistema de controle de frequência e gestão de funcionários desenvolvido como projeto acadêmico que resultou em **nota 10/10**. Implementa autenticação JWT, CRUD completo e geração de relatórios PDF.

## ✨ O que faz

- 👥 **Gestão de Funcionários** - Cadastro com departamentos e cargos
- ⏰ **Controle de Ponto** - Registro de horas com validações automáticas  
- 📊 **Relatórios PDF** - Geração dinâmica de relatórios de frequência
- 🔐 **Autenticação JWT** - Sistema seguro com controle de permissões
- 📱 **Interface Responsiva** - Dashboard moderno e intuitivo

## 🛠 Stack Tecnológico

**Backend:** Node.js + Express + Prisma ORM + MySQL + JWT + BCrypt  
**Frontend:** HTML5 + CSS3 + JavaScript Vanilla + Fetch API  
**Extras:** PDFKit, Zod, Multer, Logs estruturados

## ⚡ Quick Start

### 📋 Pré-requisitos
- [Node.js](https://nodejs.org/) (LTS)
- [MySQL](https://dev.mysql.com/downloads/) ou [XAMPP](https://www.apachefriends.org/)

### 🚀 Instalação e Configuração

**1. Clone e instale:**
```bash
git clone https://github.com/JGabrielFbeserra/sistema-controle-ponto.git
cd sistema-controle-ponto

# Backend
cd backend && npm install

# Frontend  
cd ../frontend && npm install
```

**2. Configure o banco (.env):**
```bash
cd backend
cp .env.example .env
# Edite .env com suas credenciais MySQL
```

**3. Execute as migrations:**
```bash
npx prisma db push && npx prisma generate
```

**4. Execute o projeto:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm start
```

**5. Acesse:**
- Frontend: http://localhost:3001
- API: http://localhost:3000

## 🏗 Arquitetura

### 📊 Banco de Dados
```sql
Usuario (id, email, password, role)
├── Funcionario (nome, cargo, foto, departamentoId)
└── RelatorioPonto (data, horasTrabalhadas)

Departamento (id, nome, descricao)
└── Funcionarios[]
```

### 🛡 API Endpoints
```bash
# Autenticação
POST /auth/login|logout|register

# Recursos (CRUD completo)
GET|POST|PUT|DELETE /funcionarios
GET|POST|PUT|DELETE /departamentos  
GET|POST|PUT|DELETE /relatorios
GET|POST|PUT|DELETE /usuarios

# Extras
GET /relatorios/pdf  # Gerar PDF
```

## 🎯 Funcionalidades Principais

### ⏰ Controle de Ponto  
- Registro manual de horas trabalhadas
- Validações de data e período
- Histórico completo por usuário

### 📊 Relatórios Dinâmicos
- Geração de PDF com PDFKit
- Filtros por período customizável
- Design profissional e organizado

### 🔐 Segurança Robusta
- JWT com expiração configurável
- Senhas criptografadas (BCrypt)
- Controle de permissões por role
- Logs estruturados para auditoria

## 🚀 Para Desenvolvedores

### 📁 Estrutura do Projeto
```
backend/src/
├── controllers/    # Lógica de negócio  
├── middlewares/    # Auth, validação, logs
├── models/         # Camada de dados
├── routes/         # Definição de rotas
└── server.js       # Ponto de entrada

frontend/public/
├── index.html      # Interface principal
├── app.js          # Lógica frontend  
├── api.js          # Calls para backend
└── style.css       # Estilos
```

### 🔧 Scripts Úteis
```bash
# Backend
npm run dev      # Desenvolvimento c/ nodemon
npm start        # Produção

# Frontend
npm start        # Servidor estático
```

---

## 🎓 Sobre o Projeto

**Desenvolvido para:** Disciplina de Desenvolvimento Web 1  
**Resultado:** Nota 9/10 ⭐  
**Objetivo:** Demonstrar domínio completo de desenvolvimento web full-stack moderno  
**Contexto:** Projeto acadêmico focado em aprendizado e boas práticas

---

*Sistema de estudo que simula um controle de ponto empresarial real, implementando as principais tecnologias e padrões do mercado web atual.*
