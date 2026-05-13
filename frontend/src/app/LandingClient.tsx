"use client";

import { useRouter } from 'next/navigation';
import { RoleSelector } from '@/components/RoleSelector';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F0EBE1] flex flex-col items-center py-20 px-4">
      <div className="max-w-4xl w-full text-center space-y-6 mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600 tracking-tight">
          AI Screening System
        </h1>
        <p className="text-xl text-stone-500 max-w-2xl mx-auto">
          Experience our AI-powered technical interviews. Select a role below to start your evaluation.
        </p>
      </div>

      <RoleSelector onSelect={setRole} selectedRole={role} />

      <div className="mt-16 transition-all duration-300 transform">
        <Button
          size="lg"
          disabled={!role}
          onClick={() => role && router.push(`/upload?role=${encodeURIComponent(role)}`)}
          className={`w-64 text-lg py-4 shadow-orange-900/10 shadow-xl ${!role ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
