import { create } from 'zustand';
import { Question } from '../lib/types';

interface InterviewState {
  sessionId: string | null;
  role: string | null;
  candidateName: string | null;
  extractedSkills: string[];
  currentQuestion: Question | null;
  questionsAnswered: number;
  totalQuestions: number;
  status: 'idle' | 'uploading' | 'interviewing' | 'completed';
  
  setSession: (sessionId: string, role: string, candidateName: string | null, skills: string[]) => void;
  setCurrentQuestion: (q: Question) => void;
  incrementQuestionsAnswered: () => void;
  setStatus: (status: 'idle' | 'uploading' | 'interviewing' | 'completed') => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  sessionId: null,
  role: null,
  candidateName: null,
  extractedSkills: [],
  currentQuestion: null,
  questionsAnswered: 0,
  totalQuestions: 8,
  status: 'idle',
  
  setSession: (sessionId, role, candidateName, skills) => set({
    sessionId, role, candidateName, extractedSkills: skills
  }),
  setCurrentQuestion: (q) => set({ currentQuestion: q }),
  incrementQuestionsAnswered: () => set((state) => ({ questionsAnswered: state.questionsAnswered + 1 })),
  setStatus: (status) => set({ status })
}));
