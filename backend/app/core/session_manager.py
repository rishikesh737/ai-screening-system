from sqlalchemy.orm import Session
from app.db import crud
from app.db.models import InterviewSession
from app.core.rag_pipeline import get_topic_list, retrieve_context
from app.core.question_generator import generate_question
from app.core.answer_evaluator import generate_session_report_dict
from app.config import settings
import datetime

class InterviewSessionManager:
    def __init__(self, db: Session):
        self.db = db

    def start_session(self, session_id: str):
        session = crud.get_session(self.db, session_id)
        if not session:
            raise ValueError("Session not found")
        
        skills = session.extracted_skills.get("skills", [])
        domains = session.extracted_skills.get("domains", [])
        exp_level = session.extracted_skills.get("experience_level", "junior")
        
        topics = get_topic_list(session.role, domains, skills)
        
        # Store topics in the extracted_skills JSON to avoid adding new schema columns
        extracted_skills = dict(session.extracted_skills)
        extracted_skills["_assigned_topics"] = topics
        session.extracted_skills = extracted_skills
        
        # Mark as active
        session.status = "active"
        crud.update_session(self.db, session)

        # If topic list is empty for some reason
        first_topic = topics[0] if topics else f"General {session.role} questions"
        return self._generate_next_question(session, 1, first_topic, exp_level)

    def _generate_next_question(self, session: InterviewSession, question_number: int, topic: str, exp_level: str):
        skills = session.extracted_skills.get("skills", [])
        domains = session.extracted_skills.get("domains", [])
        
        context = retrieve_context(session.role, skills, domains, topic)
        
        previous_qa = []
        if question_number > 1:
            prev_questions = crud.get_session_questions(self.db, str(session.id))
            for q in prev_questions:
                if q.question_number < question_number:
                    ans = crud.get_answer_for_question(self.db, str(q.id))
                    if ans:
                        previous_qa.append({"question": q.question_text, "answer": ans.answer_text})
        
        q_text = generate_question(session.role, topic, context, previous_qa, exp_level)
        
        return crud.create_question(
            self.db,
            session_id=str(session.id),
            question_number=question_number,
            question_text=q_text,
            topic=topic,
            context=context
        )

    def process_answer(self, session_id: str, question_id: str, answer_text: str):
        session = crud.get_session(self.db, session_id)
        question = crud.get_question(self.db, question_id)
        
        word_count = len(answer_text.split())
        
        crud.create_answer(
            self.db,
            question_id=question_id,
            session_id=session_id,
            answer_text=answer_text,
            word_count=word_count
        )
        
        current_num = question.question_number
        if current_num >= settings.MAX_QUESTIONS:
            session.status = "completed"
            session.completed_at = datetime.datetime.utcnow()
            crud.update_session(self.db, session)
            
            self._generate_report(session)
            return None
            
        topics = session.extracted_skills.get("_assigned_topics", [])
        next_topic = topics[current_num] if current_num < len(topics) else f"Advanced {session.role} questions"
        exp_level = session.extracted_skills.get("experience_level", "junior")
        
        return self._generate_next_question(session, current_num + 1, next_topic, exp_level)

    def _generate_report(self, session):
        questions = crud.get_session_questions(self.db, str(session.id))
        
        transcript = ""
        for q in questions:
            ans = crud.get_answer_for_question(self.db, str(q.id))
            ans_text = ans.answer_text if ans else "No answer provided."
            transcript += f"Q: {q.question_text}\nA: {ans_text}\n\n"
            
        report_dict = generate_session_report_dict(transcript, session.role)
        
        topics_covered = [q.topic for q in questions]
        
        crud.create_report(
            self.db,
            session_id=str(session.id),
            summary=report_dict.get("summary", ""),
            topics_covered=topics_covered,
            total_questions=len(questions)
        )

    def get_current_progress(self, session_id: str) -> dict:
        session = crud.get_session(self.db, session_id)
        if not session:
            return {}
            
        ans_count = crud.count_session_answers(self.db, session_id)
        return {
            "questions_answered": ans_count,
            "total_questions": settings.MAX_QUESTIONS,
            "status": session.status
        }
