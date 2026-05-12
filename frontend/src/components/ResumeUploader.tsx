import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon } from 'lucide-react';

interface ResumeUploaderProps {
  onUpload: (file: File, name: string) => void;
  isUploading: boolean;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUpload, isUploading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1 
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Candidate Name (Optional)</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800/50'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex flex-col items-center text-blue-400 space-y-3">
            <FileIcon size={48} />
            <p className="font-medium text-lg">{file.name}</p>
            <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-slate-400 space-y-4">
            <UploadCloud size={48} className="text-slate-500" />
            <p className="text-lg">Drag & drop your resume PDF here</p>
            <p className="text-sm text-slate-500">or click to browse files</p>
          </div>
        )}
      </div>

      {file && (
        <button 
          onClick={() => onUpload(file, name)}
          disabled={isUploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
        >
          {isUploading ? 'Uploading & Analyzing...' : 'Upload & Start Interview'}
        </button>
      )}
    </div>
  );
};
