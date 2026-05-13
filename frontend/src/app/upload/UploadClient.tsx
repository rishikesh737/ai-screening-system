"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ResumeUploader } from '@/components/ResumeUploader';
import { uploadResume, startInterview } from '@/lib/api';
import { useInterviewStore } from '@/store/interviewStore';
import { Spinner } from '@/components/ui/Spinner';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const LOADING_STEPS = [
  { text: "Reading your resume...", time: 0 },
  { text: "Extracting skills & experience...", time: 1200 },
  { text: "Querying knowledge base...", time: 2500 },
  { text: "Generating your interview plan...", time: 3800 },
];

function LoadingSequence({ extractedSkills }: { extractedSkills: string[] }) {
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
    <div className="w-full max-w-2xl mx-auto bg-white border border-stone-200 rounded-2xl p-8 space-y-6">
      <div className="space-y-4">
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

      {extractedSkills.length > 0 && (
        <div className="pt-6 border-t border-stone-200 mt-6">
          <p className="text-sm text-stone-500 mb-3 uppercase tracking-wider">Extracted Skills</p>
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-2"
          >
            {extractedSkills.map((skill, idx) => {
              const colors = [
                'bg-orange-500/20 text-orange-700 border-orange-500/20',
                'bg-purple-500/20 text-purple-300 border-purple-500/30',
                'bg-green-500/20 text-green-300 border-green-500/30',
                'bg-teal-500/20 text-teal-300 border-teal-500/30',
                'bg-orange-500/20 text-orange-300 border-orange-500/30',
                'bg-pink-500/20 text-pink-300 border-pink-500/30'
              ];
              const colorClass = colors[idx % colors.length];

              return (
                <motion.span
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                  }}
                  className={`px-3 py-1 rounded-full text-sm border ${colorClass}`}
                >
                  {skill}
                </motion.span>
              );
            })}
          </motion.div>
        </div>
      )}
    </div>
  );
}

function UploadContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role');
  const setSession = useInterviewStore(state => state.setSession);
  const setCurrentQuestion = useInterviewStore(state => state.setCurrentQuestion);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);

  useEffect(() => {
    if (!role) {
      router.push('/');
    }
  }, [role, router]);

  const handleUpload = async (file: File, name: string) => {
    if (!role) return;
    try {
      setIsUploading(true);
      const res = await uploadResume(file, role, name);
      setExtractedSkills(res.extracted_skills || []);
      setSession(res.session_id, res.role, res.candidate_name, res.extracted_skills);
      
      const q = await startInterview(res.session_id);
      setCurrentQuestion(q);
      
      setTimeout(() => {
        router.push(`/interview/${res.session_id}`);
      }, 1200);
    } catch (error) {
      console.error(error);
      alert('Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  if (!role) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F0EBE1] flex flex-col items-center py-20 px-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-stone-900">Upload Your Resume</h1>
          <p className="text-stone-500">Applying for <span className="text-orange-600 font-semibold">{role}</span></p>
        </div>
        
        {isUploading ? (
          <LoadingSequence extractedSkills={extractedSkills} />
        ) : (
          <ResumeUploader onUpload={handleUpload} isUploading={isUploading} />
        )}
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F0EBE1] flex items-center justify-center"><Spinner /></div>}>
      <UploadContent />
    </Suspense>
  );
}
