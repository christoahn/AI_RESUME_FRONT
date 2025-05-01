export interface Project {
  name: string;
  position?: string;
  duration: string;
  description?: string | string[];
  keywords?: string;
}

export interface Job {
  name: string;
  position: string;
  duration: string;
  description?: string | string[];
  keywords?: string;
}

export interface Research {
  name: string;
  duration: string;
  description?: string | string[];
  keywords?: string;
}

export interface Education {
  name: string;
  degree: string;
  major: string;
  duration: string;
  gpa?: string;
  description?: string | string[];
}

export interface BasicInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ResumeDataResponse {
  resume_id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  projects?: { [key: string]: Project };
  jobs?: { [key: string]: Job };
  researchs?: { [key: string]: Research };
  educations?: { [key: string]: Education };
}

export interface ResumeData extends BasicInfo {
  projects?: Project[];
  jobs?: Job[];
  researchs?: Research[];
  educations?: Education[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

export interface ChatResponse {
  status: 'success' | 'error';
  message: string;
  updated_json?: ResumeDataResponse;
} 