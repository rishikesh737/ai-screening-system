from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.session import SessionStatusResponse
from app.core.session_manager import InterviewSessionManager
from app.db import crud

router = APIRouter()

@router.get("/{session_id}", response_model=SessionStatusResponse)
def get_session_status(session_id: str, db: Session = Depends(get_db)):
    session = crud.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    manager = InterviewSessionManager(db)
    progress = manager.get_current_progress(session_id)
    
    return SessionStatusResponse(
        session_id=str(session.id),
        role=session.role,
        status=session.status,
        questions_answered=progress.get("questions_answered", 0),
        total_questions=progress.get("total_questions", 8)
    )
