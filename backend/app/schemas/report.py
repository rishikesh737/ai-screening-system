from pydantic import BaseModel
from typing import List, Optional

class QAPair(BaseModel):
    question_number: int
    topic: str
    question: str
    answer: str
    word_count: int

class ReportResponse(BaseModel):
    session_id: str
    candidate_name: Optional[str]
    role: str
    topics_covered: List[str]
    total_questions: int
    summary: str
    qa_pairs: List[QAPair]
