from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, default="guest") # simplified for Phase 2
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    tier = Column(String)
    overall_score = Column(Float)
    harmony_score = Column(Float)
    angularity_score = Column(Float)
    dimorphism_score = Column(Float)
    skin_score = Column(Float)
