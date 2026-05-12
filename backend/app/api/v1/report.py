from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.report import ReportResponse, QAPair
from app.db import crud

router = APIRouter()

@router.get("/{session_id}", response_model=ReportResponse)
def get_report(session_id: str, db: Session = Depends(get_db)):
    session = crud.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    report = crud.get_report(db, session_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not generated yet")
        
    questions = crud.get_session_questions(db, session_id)
    qa_pairs = []
    
    for q in questions:
        ans = crud.get_answer_for_question(db, str(q.id))
        qa_pairs.append(QAPair(
            question_number=q.question_number,
            topic=q.topic,
            question=q.question_text,
            answer=ans.answer_text if ans else "",
            word_count=ans.word_count if ans else 0
        ))
        
    return ReportResponse(
        session_id=str(session.id),
        candidate_name=session.candidate_name,
        role=session.role,
        topics_covered=report.topics_covered,
        total_questions=report.total_questions,
        summary=report.summary,
        qa_pairs=qa_pairs
    )
