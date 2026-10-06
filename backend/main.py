from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import engine, Base, get_db
import models
from ai_engine import analyze_face

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ChadFramed AI Engine API")

# Allow mobile app to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Receives an image, processes it through the MediaPipe AI Engine, 
    saves the result to the database, and returns the biometric data.
    """
    try:
        contents = await file.read()
        analysis_result = analyze_face(contents)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    # Save to Database
    db_scan = models.ScanHistory(
        user_id="guest_operative",
        tier=analysis_result["tier"],
        overall_score=analysis_result["score"],
        harmony_score=analysis_result["metrics"]["harmony"],
        angularity_score=analysis_result["metrics"]["angularity"],
        dimorphism_score=analysis_result["metrics"]["dimorphism"],
        skin_score=analysis_result["metrics"]["skin"]
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    
    return {
        "status": "success",
        "scan_id": db_scan.id,
        "data": analysis_result
    }

@app.get("/history")
def get_history(limit: int = 10, db: Session = Depends(get_db)):
    """
    Retrieves the historical scan records from the database.
    """
    scans = db.query(models.ScanHistory).order_by(models.ScanHistory.timestamp.desc()).limit(limit).all()
    return {"status": "success", "data": scans}

from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    biometric_context: dict = None

@app.post("/chat")
def facegpt_chat(req: ChatRequest):
    """
    Simulates the FaceGPT LLM response. Uses the user's latest biometric 
    context to provide personalized, brutal clinical advice.
    (Replace this logic with actual OpenAI GPT-4o API call later)
    """
    msg = req.message.lower()
    context = req.biometric_context or {}
    
    tier = context.get("tier", "UNKNOWN")
    fwhr = context.get("fwhr", "N/A")
    
    response = ""
    
    if "jaw" in msg or "angularity" in msg:
        response = f"ANALYSIS: Your gonial angle projection correlates with your {tier} tier classification. Reducing subcutaneous water retention and inducing masseter hypertrophy via heavy mastication can improve lateral width."
    elif "eyes" in msg or "canthal" in msg:
        response = "ANALYSIS: Intercanthal distance is genetically fixed. If negative canthal tilt is present, surgical canthoplasty is the only protocol to permanently alter the orbital vector."
    elif "score" in msg or "tier" in msg:
        response = f"ANALYSIS: You are currently classified as {tier}. Your calculated fWHR is {fwhr}. Substantial biometric manipulation is required to ascend to the next tier."
    else:
        response = f"SYSTEM RESPONSE: Query acknowledged. Current classification is {tier}. State your specific biometric concern (e.g., jawline, eyes, skin) for targeted intervention directives."

    return {"status": "success", "reply": response}

@app.get("/")
def health_check():
    return {"status": "online", "message": "ChadFramed AI Engine Active"}
