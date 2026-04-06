<div>

# AI Smart Manager 🤖✅

**A task manager with JWT auth, MongoDB storage, and an AI microservice that generates subtasks.**

[![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=000)](#-tech-stack)
[![Backend](https://img.shields.io/badge/Backend-Express-000000?logo=express&logoColor=fff)](#-tech-stack)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=fff)](#-tech-stack)
[![AI%20Microservice](https://img.shields.io/badge/AI%20Microservice-FastAPI-009688?logo=fastapi&logoColor=fff)](#-tech-stack)
[![Language](https://img.shields.io/badge/Python-3.12+-3776AB?logo=python&logoColor=fff)](#-tech-stack)
[![License](https://img.shields.io/badge/License-MIT-informational)](#-license)

</div>

---

## Screenshot

<img src="screenshot.png"/>

## 🌐 **Live Demo:** https://ai-smart-manager.vercel.app/

---

## ✨ Highlights

- **🔐 Auth**: signup/login with JWT.
- **🗂️ Tasks**: CRUD, status toggle, subtasks.
- **🧠 AI subtasks**: generate 3–5 actionable subtasks via a Python microservice.
- **⚡ Local dev**: Vite frontend + Express API + FastAPI AI service.

---

## 🧰 Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend API**: Node.js + Express + Mongoose (MongoDB) + JWT
- **AI microservice**: FastAPI + OpenAI SDK

---

## 📁 Project Structure

```text
AI-Smart-Manager/
  src/                     # React frontend (Vite)
    api/
      api.js
    components/
    App.jsx
    main.jsx
  backend/                 # Node/Express API (MongoDB + JWT)
    server.js
    routes/
      auth.js
      task.js
    models/
      User.js
      Task.js
    .env                   # backend env vars (keep private)
  ai_backend/              # Python FastAPI microservice (OpenAI)
    main.py
    services/
      ai_service.py
    .env                   # OPENAI_API_KEY (keep private)
  README.md
```

---

## 🚀 Quick Start

### Prereqs

- **Node.js** (for frontend + Node backend)
- **Python 3.12+** (for `ai_backend/`)
- **MongoDB connection string** (local MongoDB or MongoDB Atlas)

### 1) AI microservice (FastAPI, port `8001`)

From the project root:

```bash
cd ai_backend
python -m venv .venv
source .venv/bin/activate
pip install -U pip

# If you have requirements.txt, use it. Otherwise install from pyproject deps.
pip install -r requirements.txt || pip install "fastapi" "uvicorn" "openai" "python-dotenv"

uvicorn main:app --reload --port 8001
```

AI service: `http://localhost:8001`

### 2) Backend API (Express, port `8000`)

From the project root:

```bash
cd backend
npm install
npm run dev
```

API: `http://localhost:8000`

### 3) Frontend (React/Vite, port `5173`)

From the project root:

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`

---

## 🔑 Environment Variables

### `backend/.env` (Node API)

Create `backend/.env` with:

```bash
MONGO_URI="mongodb+srv://..."
JWT_SECRET="replace-me"
```

### `ai_backend/.env` (AI microservice)

Create `ai_backend/.env` with:

```bash
OPENAI_API_KEY="replace-me"
```

---

## 🔌 API

The frontend uses `src/api/api.js` and includes `Authorization: Bearer <token>` for protected routes.

Default ports:

- **Frontend**: `5173`
- **Backend API**: `8000`
- **AI microservice**: `8001`

Key endpoints:

- **`POST /auth/signup`**: create user
- **`POST /auth/login`**: returns `{ token }`
- **`GET /tasks`**: list tasks (auth required)
- **`POST /tasks`**: create task (auth required)
- **`PUT /tasks/:id/toggle`**: advance status (auth required)
- **`PATCH /tasks/:id`**: edit title (auth required)
- **`DELETE /tasks/:id`**: delete (auth required)
- **`PATCH /tasks/:id/subtasks`**: generate & attach subtasks (auth required; backend calls AI service `POST /generate-subtasks`)

---

## 🧪 Troubleshooting

- **CORS errors**: ensure the backend allows your frontend origin (e.g. `http://localhost:5173`).
- **AI not responding**: ensure `ai_backend` is running on port `8001` and `OPENAI_API_KEY` is set.
- **Frontend can’t reach backend**: confirm the backend base URL in `src/api/api.js`.
- **Mongo connection errors**: verify `MONGO_URI` and that your IP is allowed (Atlas).

---

## 🤝 Contributing

PRs are welcome.

- Create a feature branch
- Keep changes focused
- Add screenshots for UI changes when possible

---

## 📄 License

MIT (adjust if your project uses a different license).

