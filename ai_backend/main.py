from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models.request_models import SubTaskRequest
from services.ai_service import generate_subtasks

app = FastAPI()

# ✅ CORS (React/JS connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-chat-app-six-alpha.vercel.app",
        "http://localhost:5173"
    ],  # 🔥 Allow all (for DEV)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/generate-subtasks")
async def generate_project_subtasks(data: SubTaskRequest):
    try:
        result = await generate_subtasks(data)
        print(result)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))