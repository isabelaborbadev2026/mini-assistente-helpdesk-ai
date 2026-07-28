# 🤖 Mini Assistente com IA

## 📌 Sobre o projeto

O Mini Assistente com IA é uma aplicação web desenvolvida para responder perguntas de forma rápida utilizando a API Google Gemini.

O usuário digita uma pergunta no navegador, o frontend envia essa pergunta para o backend, o backend consulta a IA e retorna a resposta para ser exibida na tela.

---

## 🚀 Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- API Google Gemini
- JSON
- HTTP

---

## 📂 Estrutura do projeto

```
frontend/
│
├── index.html
├── style.css
└── script.js

src/
│
├── routes/
│   └── aiRoutes.js
│
├── services/
│   └── iaService.js
│
├── app.js
└── server.js
```

---

## ⚙️ Como executar o projeto

### 1. Clone o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Crie um arquivo `.env`

```env
GEMINI_API_KEY=SUA_CHAVE_AQUI
PORT=3000
```

### 4. Execute o backend

```bash
node src/server.js
```

### 5. Abra o frontend

Abra o arquivo `frontend/index.html` utilizando a extensão **Live Server** do Visual Studio Code.

---

## 💻 Funcionalidades

- Fazer perguntas para a IA.
- Receber respostas em tempo real.
- Validação de campo vazio.
- Tratamento de erros de conexão.
- Interface simples e intuitiva.

---

## 🔄 Fluxo da aplicação

Usuário

↓

Frontend (HTML, CSS e JavaScript)

↓

Backend (Node.js + Express)

↓

Google Gemini

↓

Backend

↓

Frontend

↓

Resposta exibida ao usuário

---

## 👩‍💻 Desenvolvido por

Isabela Borba Franco