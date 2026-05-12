export interface ResumeUploadResponse {
  session_id: string;
  candidate_name: string | null;
  role: string;
  extracted_skills: string[];
  resume_preview: string;
}

export interface Question {
  question_id: string;
  question_number: number;
  total_questions: number;
  question_text: string;
  topic: string;
}

export interface NextQuestion extends Question {}

export interface SubmitAnswerResponse {
  saved: boolean;
  next_question: NextQuestion | null;
  interview_complete?: boolean;
  session_id?: string;
}

export interface SessionStatusResponse {
  session_id: string;
  role: string;
  status: 'initializing' | 'active' | 'completed';
  questions_answered: number;
  total_questions: number;
}

export interface QAPair {
  question_number: number;
  topic: string;
  question: string;
  answer: string;
  word_count: number;
}

export interface ReportResponse {
  session_id: string;
  candidate_name: string | null;
  role: string;
  topics_covered: string[];
  total_questions: number;
  summary: string;
  qa_pairs: QAPair[];
}
