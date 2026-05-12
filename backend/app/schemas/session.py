from pydantic import BaseModel

class SessionStatusResponse(BaseModel):
    session_id: str
    role: str
    status: str
    questions_answered: int
    total_questions: int
