"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ResumeUploader } from '@/components/ResumeUploader';
import { uploadResume, startInterview } from '@/lib/api';
import { useInterviewStore } from '@/store/interviewStore';
import { Spinner } from '@/components/ui/Spinner';

function UploadContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role');
  const setSession = useInterviewStore(state => state.setSession);
  const setCurrentQuestion = useInterviewStore(state => state.setCurrentQuestion);
  const [isUploading, setIsUploading] = useState(false);

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
      setSession(res.session_id, res.role, res.candidate_name, res.extracted_skills);
      
      const q = await startInterview(res.session_id);
      setCurrentQuestion(q);
      
      router.push(`/interview/${res.session_id}`);
    } catch (error) {
      console.error(error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!role) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-20 px-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Upload Your Resume</h1>
          <p className="text-slate-400">Applying for <span className="text-blue-400 font-semibold">{role}</span></p>
        </div>
        
        <ResumeUploader onUpload={handleUpload} isUploading={isUploading} />
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><Spinner /></div>}>
      <UploadContent />
    </Suspense>
  );
}
