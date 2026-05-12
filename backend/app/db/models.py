from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSON
import uuid
import datetime
from app.db.database import Base

class InterviewSession(Base):
    __tablename__ = "interview_sessions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_name = Column(String, nullable=True)
    role = Column(String, nullable=False)
    resume_text = Column(Text, nullable=False)
    extracted_skills = Column(JSON, nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class Question(Base):
    __tablename__ = "questions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("interview_sessions.id"))
    question_number = Column(Integer, nullable=False)
    question_text = Column(Text, nullable=False)
    topic = Column(String, nullable=False)
    retrieved_context = Column(Text, nullable=False)
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)

class Answer(Base):
    __tablename__ = "answers"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id"))
    session_id = Column(UUID(as_uuid=True), ForeignKey("interview_sessions.id"))
    answer_text = Column(Text, nullable=False)
    word_count = Column(Integer, nullable=False)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)

class SessionReport(Base):
    __tablename__ = "session_reports"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("interview_sessions.id"), unique=True)
    summary = Column(Text, nullable=False)
    topics_covered = Column(JSON, nullable=False)
    total_questions = Column(Integer, nullable=False)
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)
