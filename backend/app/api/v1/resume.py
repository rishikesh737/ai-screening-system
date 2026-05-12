from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import crud
from app.core.resume_parser import parse_resume
from app.schemas.resume import ResumeUploadResponse

router = APIRouter()

@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    role: str = Form(...),
    candidate_name: str = Form(None),
    db: Session = Depends(get_db)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    content = await file.read()
    parsed_data = parse_resume(content)
    
    resume_text = parsed_data.get("_raw_text", "")
    skills = parsed_data.get("skills", [])
    
    session = crud.create_session(
        db,
        candidate_name=candidate_name if candidate_name else "",
        role=role,
        resume_text=resume_text,
        extracted_skills=parsed_data
    )
    
    return ResumeUploadResponse(
        session_id=str(session.id),
        candidate_name=session.candidate_name,
        role=session.role,
        extracted_skills=skills,
        resume_preview=resume_text[:300]
    )
