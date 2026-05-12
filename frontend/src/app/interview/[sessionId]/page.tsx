"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInterviewStore } from '@/store/interviewStore';
import { submitAnswer, getSessionStatus } from '@/lib/api';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { AnswerInput } from '@/components/AnswerInput';
import { Spinner } from '@/components/ui/Spinner';

export default function InterviewPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const { sessionId } = params;
  
  const currentQuestion = useInterviewStore(state => state.currentQuestion);
  const setCurrentQuestion = useInterviewStore(state => state.setCurrentQuestion);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(!currentQuestion);

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
      const res = await submitAnswer(sessionId, currentQuestion!.question_id, answer);
      
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
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Spinner /></div>;
  }

  if (!currentQuestion) {
    return <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
      <p className="mb-4">No active question found.</p>
      <button className="text-blue-400 underline" onClick={() => router.push('/')}>Return Home</button>
    </div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8">
        <ProgressBar current={currentQuestion.question_number} total={currentQuestion.total_questions} />
        
        <QuestionCard 
          topic={currentQuestion.topic} 
          question={currentQuestion.question_text} 
        />
        
        <AnswerInput onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
