from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
import os

from dotenv import load_dotenv

# load environment variables from .env (works cross-platform)
load_dotenv()

from .ai_service import proofread_text

app = FastAPI(title="Proofreader API")

# simple request/response models
class TextRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    result: str


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: TextRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text must not be empty")

    # call ai service synchronously for now
    try:
        answer = proofread_text(request.text)
    except Exception as exc:
        # propagate a helpful message to the client
        raise HTTPException(status_code=500, detail=str(exc))

    return AnalyzeResponse(result=answer)

# serve frontend files. After building the React app the static
# assets live under `frontend/dist`; during development you may instead
# run the React dev server separately.
static_dir = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
# If the build directory doesn't exist yet, fall back to the raw frontend
# folder so the original single‑page demo still works.
if not os.path.isdir(static_dir):
    static_dir = os.path.join(os.path.dirname(__file__), "..", "..", "frontend")

app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
