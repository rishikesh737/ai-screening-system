from sqlalchemy.orm import Session
from app.db.models import InterviewSession, Question, Answer, SessionReport

def get_session(db: Session, session_id: str):
    return db.query(InterviewSession).filter(InterviewSession.id == session_id).first()

def create_session(db: Session, candidate_name: str, role: str, resume_text: str, extracted_skills: dict):
    session = InterviewSession(
        candidate_name=candidate_name,
        role=role,
        resume_text=resume_text,
        extracted_skills=extracted_skills,
        status="initializing"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

def update_session(db: Session, session: InterviewSession):
    db.commit()
    db.refresh(session)
    return session

def create_question(db: Session, session_id: str, question_number: int, question_text: str, topic: str, context: str):
    new_q = Question(
        session_id=session_id,
        question_number=question_number,
        question_text=question_text,
        topic=topic,
        retrieved_context=context
    )
    db.add(new_q)
    db.commit()
    db.refresh(new_q)
    return new_q

def get_question(db: Session, question_id: str):
    return db.query(Question).filter(Question.id == question_id).first()

def get_session_questions(db: Session, session_id: str):
    return db.query(Question).filter(Question.session_id == session_id).order_by(Question.question_number).all()

def create_answer(db: Session, question_id: str, session_id: str, answer_text: str, word_count: int):
    ans = Answer(
        question_id=question_id,
        session_id=session_id,
        answer_text=answer_text,
        word_count=word_count
    )
    db.add(ans)
    db.commit()
    db.refresh(ans)
    return ans

def get_answer_for_question(db: Session, question_id: str):
    return db.query(Answer).filter(Answer.question_id == question_id).first()

def count_session_answers(db: Session, session_id: str):
    return db.query(Answer).filter(Answer.session_id == session_id).count()

def create_report(db: Session, session_id: str, summary: str, topics_covered: list, total_questions: int):
    report = SessionReport(
        session_id=session_id,
        summary=summary,
        topics_covered=topics_covered,
        total_questions=total_questions
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

def get_report(db: Session, session_id: str):
    return db.query(SessionReport).filter(SessionReport.session_id == session_id).first()
