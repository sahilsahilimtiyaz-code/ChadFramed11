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

@app.get("/")
def health_check():
    return {"status": "online", "message": "ChadFramed AI Engine Active"}
