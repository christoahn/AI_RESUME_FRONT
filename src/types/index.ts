export interface Project {
  name: string;
  position?: string;
  duration: string;
  description?: string | string[];
}

export interface Job {
  name: string;
  position: string;
  duration: string;
  description?: string | string[];
}

export interface Research {
  name: string;
  duration: string;
  description?: string | string[];
}

export interface Education {
  name: string;
  degree: string;
  duration: string;
  major: string;
  gpa?: string;
  description?: string | string[];
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  address: string;
  projects?: Project[];
  jobs?: Job[];
  educations?: Education[];
  researchs?: Research[];
}

export interface ChatMessage {
  content: string;
  isUser: boolean;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface ChatResponse extends ApiResponse<{
  response: string;
  updated_json?: ResumeData;
}> {} 