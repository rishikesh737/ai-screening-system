from pydantic import BaseModel
from typing import Optional

class StartInterviewRequest(BaseModel):
    session_id: str

class NextQuestion(BaseModel):
    question_id: str
    question_number: int
    total_questions: int
    question_text: str
    topic: str

class SubmitAnswerRequest(BaseModel):
    session_id: str
    question_id: str
    answer_text: str

class SubmitAnswerResponse(BaseModel):
    saved: bool
    next_question: Optional[NextQuestion] = None
    interview_complete: Optional[bool] = None
    session_id: Optional[str] = None
