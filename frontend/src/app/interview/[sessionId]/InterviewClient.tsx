"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInterviewStore } from '@/store/interviewStore';
import { submitAnswer, getSessionStatus } from '@/lib/api';
import { QuestionCard } from '@/components/QuestionCard';
import { AnswerInput } from '@/components/AnswerInput';
import { Spinner } from '@/components/ui/Spinner';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const LOADING_STEPS = [
  { text: "Evaluating your answer...", time: 0 },
  { text: "Retrieving next context...", time: 1200 },
  { text: "Generating next question...", time: 2400 }
];

function InterstitialLoading() {
  const [activeStep, setActiveStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  
  useEffect(() => {
    const timers = LOADING_STEPS.map((step, idx) => {
      if (idx === 0) return null;
      return setTimeout(() => {
        setActiveStep(s => Math.max(s, idx));
      }, step.time);
    });
    return () => timers.forEach(t => t && clearTimeout(t));
  }, []);

  return (
    <div className="w-full bg-stone-50 border border-orange-200 rounded-2xl p-8 space-y-6">
      {LOADING_STEPS.map((step, idx) => {
        const isActive = activeStep === idx;
        const isDone = activeStep > idx;
        const isPending = activeStep < idx;

        return (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: isPending ? 0 : 1, y: isPending ? (shouldReduceMotion ? 0 : 10) : 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              {isDone ? (
                <CheckCircle2 className="text-green-500 w-5 h-5" />
              ) : isActive ? (
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping" />
              ) : (
                <div className="w-3 h-3 bg-stone-200 rounded-full" />
              )}
            </div>
            <span className={`text-lg ${isActive ? 'text-stone-900' : isDone ? 'text-stone-600' : 'text-stone-400'}`}>
              {step.text}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function InterviewClient({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const { sessionId } = params;
  
  const currentQuestion = useInterviewStore(state => state.currentQuestion);
  const setCurrentQuestion = useInterviewStore(state => state.setCurrentQuestion);
  const candidateName = useInterviewStore(state => state.candidateName);
  const role = useInterviewStore(state => state.role);
  const questionsAnswered = useInterviewStore(state => state.questionsAnswered);
  const totalQuestions = useInterviewStore(state => state.totalQuestions);
  const incrementQuestionsAnswered = useInterviewStore(state => state.incrementQuestionsAnswered);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(!currentQuestion);
  const [isTypewriterComplete, setIsTypewriterComplete] = useState(false);

  useEffect(() => {
    setIsTypewriterComplete(false);
  }, [currentQuestion?.question_id]);

  useEffect(() => {
    if (!currentQuestion) {
      getSessionStatus(sessionId)
        .then(res => {
          if (res.status === 'completed') {
            router.push(`/report/${sessionId}`);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [currentQuestion, sessionId, router]);

  const handleSubmit = async (answer: string) => {
    try {
      setIsSubmitting(true);
      const [res] = await Promise.all([
        submitAnswer(sessionId, currentQuestion!.question_id, answer),
        new Promise(r => setTimeout(r, 3600))
      ]);
      incrementQuestionsAnswered();
      
      if (res.interview_complete) {
        router.push(`/report/${sessionId}`);
      } else if (res.next_question) {
        setCurrentQuestion(res.next_question);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F0EBE1] flex items-center justify-center"><Spinner /></div>;
  }

  if (!currentQuestion) {
    return <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F0EBE1] flex flex-col items-center justify-center text-stone-600">
      <p className="mb-4">No active question found.</p>
      <button className="text-orange-600 underline" onClick={() => router.push('/')}>Return Home</button>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F0EBE1] py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8">
        
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-stone-600 font-medium">
              <span className="text-stone-900">{candidateName || 'Candidate'}</span> — <span className="text-orange-600">{role || 'Role'}</span>
            </div>
            <div className="text-sm font-medium text-stone-500">
              Question {currentQuestion.question_number} of {currentQuestion.total_questions}
            </div>
          </div>
          
          <div className="w-full bg-stone-100 rounded-full h-1 overflow-hidden">
            <motion.div 
              className="bg-orange-500 h-1 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, (questionsAnswered / totalQuestions) * 100))}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {isSubmitting ? (
          <InterstitialLoading />
        ) : (
          <QuestionCard 
            topic={currentQuestion.topic} 
            question={currentQuestion.question_text} 
            onComplete={() => setIsTypewriterComplete(true)}
          />
        )}
        
        {!isSubmitting && isTypewriterComplete && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <AnswerInput onSubmit={handleSubmit} isSubmitting={false} questionId={currentQuestion.question_id} />
          </motion.div>
        )}
        
      </div>
    </div>
  );
}
