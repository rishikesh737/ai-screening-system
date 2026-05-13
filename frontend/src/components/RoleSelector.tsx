import React from 'react';
import { Card } from './ui/Card';
import { Bot, Server, LineChart } from 'lucide-react';

interface RoleSelectorProps {
  onSelect: (role: string) => void;
  selectedRole?: string | null;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelect, selectedRole }) => {
  const roles = [
    { id: 'AI/ML Engineer', title: 'AI/ML Engineer', icon: <Bot size={32} className="text-orange-600" />, desc: 'PyTorch, LLMs, Computer Vision' },
    { id: 'Backend Engineer', title: 'Backend Engineer', icon: <Server size={32} className="text-emerald-600" />, desc: 'APIs, Databases, Microservices' },
    { id: 'Data Scientist', title: 'Data Scientist', icon: <LineChart size={32} className="text-purple-400" />, desc: 'Analytics, Stats, Machine Learning' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
      {roles.map(role => (
        <Card 
          key={role.id} 
          hoverable 
          onClick={() => onSelect(role.id)}
          className={`${selectedRole === role.id ? 'border-orange-400 bg-blue-900/20' : ''}`}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-stone-100 rounded-full">
              {role.icon}
            </div>
            <h3 className="text-xl font-bold text-stone-900">{role.title}</h3>
            <p className="text-stone-500">{role.desc}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
