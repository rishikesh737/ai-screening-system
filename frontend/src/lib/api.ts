import axios from 'axios';
import { ResumeUploadResponse, NextQuestion, SubmitAnswerResponse, SessionStatusResponse, ReportResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadResume = async (file: File, role: string, candidateName?: string): Promise<ResumeUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('role', role);
  if (candidateName) {
    formData.append('candidate_name', candidateName);
  }
  
  const response = await apiClient.post<ResumeUploadResponse>('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const startInterview = async (sessionId: string): Promise<NextQuestion> => {
  const response = await apiClient.post<NextQuestion>('/interview/start', { session_id: sessionId });
  return response.data;
};

export const submitAnswer = async (sessionId: string, questionId: string, answerText: string): Promise<SubmitAnswerResponse> => {
  const response = await apiClient.post<SubmitAnswerResponse>('/interview/answer', {
    session_id: sessionId,
    question_id: questionId,
    answer_text: answerText
  });
  return response.data;
};

export const getSessionStatus = async (sessionId: string): Promise<SessionStatusResponse> => {
  const response = await apiClient.get<SessionStatusResponse>(`/session/${sessionId}`);
  return response.data;
};

export const getReport = async (sessionId: string): Promise<ReportResponse> => {
  const response = await apiClient.get<ReportResponse>(`/report/${sessionId}`);
  return response.data;
};
