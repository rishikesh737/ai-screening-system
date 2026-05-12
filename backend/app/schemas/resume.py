from pydantic import BaseModel
from typing import List, Optional

class ResumeUploadResponse(BaseModel):
    session_id: str
    candidate_name: Optional[str]
    role: str
    extracted_skills: List[str]
    resume_preview: str
