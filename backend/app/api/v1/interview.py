from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.interview import StartInterviewRequest, NextQuestion, SubmitAnswerRequest, SubmitAnswerResponse
from app.core.session_manager import InterviewSessionManager
from app.config import settings

router = APIRouter()

@router.post("/start", response_model=NextQuestion)
def start_interview(req: StartInterviewRequest, db: Session = Depends(get_db)):
    manager = InterviewSessionManager(db)
    try:
        q = manager.start_session(req.session_id)
        return NextQuestion(
            question_id=str(q.id),
            question_number=q.question_number,
            total_questions=settings.MAX_QUESTIONS,
            question_text=q.question_text,
            topic=q.topic
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/answer", response_model=SubmitAnswerResponse)
def submit_answer(req: SubmitAnswerRequest, db: Session = Depends(get_db)):
    manager = InterviewSessionManager(db)
    try:
        next_q = manager.process_answer(req.session_id, req.question_id, req.answer_text)
        if next_q:
            nq = NextQuestion(
                question_id=str(next_q.id),
                question_number=next_q.question_number,
                total_questions=settings.MAX_QUESTIONS,
                question_text=next_q.question_text,
                topic=next_q.topic
            )
            return SubmitAnswerResponse(saved=True, next_question=nq)
        else:
            return SubmitAnswerResponse(
                saved=True,
                next_question=None,
                interview_complete=True,
                session_id=req.session_id
            )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
