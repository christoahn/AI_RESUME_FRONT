import axios from 'axios';
import { ResumeData, ResumeDataResponse, ApiResponse, ChatResponse } from '../types';
import { fetchWithTimeout, handleApiError } from '../utils/api';

interface BasicInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio?: string;
  address?: string;
}

interface Education {
  name: string;
  degree: string;
  major: string;
  duration: string;
  gpa?: string;
}

interface WorkExperience {
  name: string;
  position: string;
  duration: string;
  keywords: string;
}

interface Project {
  name: string;
  position: string;
  duration: string;
  keywords: string;
}

interface Research {
  name: string;
  duration: string;
  keywords: string;
}

interface ResumeData {
  basic_info: BasicInfo;
  education: Education[] | Record<string, Education>;
  work_experience: WorkExperience[] | Record<string, WorkExperience>;
  projects: Project[] | Record<string, Project>;
  researches: Research[] | Record<string, Research>;
  skills: string;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// 값이 비어있는지 확인하는 함수
const isEmpty = (value: any): boolean => {
  return value === '' || value === undefined || value === null;
};

// 값을 적절히 변환하는 함수 (빈 값은 null로 변환)
const formatValue = (value: any): any => {
  return isEmpty(value) ? null : value;
};

const resumeApi = {
  generateResume: async (data: ResumeData): Promise<ApiResponse<ResumeDataResponse>> => {
    try {
      // 백엔드 API 요청 데이터 구성
      const requestData = {
        name: formatValue(data.name),
        phone: formatValue(data.phone),
        email: formatValue(data.email),
        address: formatValue(data.address),
        projects: data.projects?.reduce((acc, proj, index) => ({
          ...acc,
          [`project${index + 1}`]: {
            name: formatValue(proj.name),
            duration: formatValue(proj.duration),
            position: formatValue(proj.position),
            description: formatValue(proj.description)
          }
        }), {}),
        jobs: data.jobs?.reduce((acc, job, index) => ({
          ...acc,
          [`job${index + 1}`]: {
            name: formatValue(job.name),
            duration: formatValue(job.duration),
            position: formatValue(job.position),
            description: formatValue(job.description)
          }
        }), {}),
        researchs: data.researchs?.reduce((acc, research, index) => ({
          ...acc,
          [`research${index + 1}`]: {
            name: formatValue(research.name),
            duration: formatValue(research.duration),
            description: formatValue(research.description)
          }
        }), {}),
        educations: data.educations?.reduce((acc, edu, index) => ({
          ...acc,
          [`education${index + 1}`]: {
            name: formatValue(edu.name),
            degree: formatValue(edu.degree),
            major: formatValue(edu.major),
            duration: formatValue(edu.duration),
            gpa: formatValue(edu.gpa),
            description: formatValue(edu.description)
          }
        }), {})
      };
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/resume`, {
        method: 'POST',
        body: JSON.stringify(requestData)
      });
      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getResume: async (id: number): Promise<ApiResponse<ResumeDataResponse>> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/resume/${id}`, {
        method: 'GET',
      });
      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateResume: async (id: number, resumeData: ResumeData): Promise<ApiResponse<ResumeDataResponse>> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/resume/${id}`, {
        method: 'PUT',
        body: JSON.stringify(resumeData),
      });
      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  generateDocx: async (html: string): Promise<Blob> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/resume/docx`, {
        method: 'POST',
        body: JSON.stringify({ html }),
      });
      return await response.blob();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  chatWithAI: async (message: string, resumeData: ResumeData): Promise<ChatResponse> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/chat`, {
        method: 'POST',
        body: JSON.stringify({ message, resumeData }),
      });
      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  healthCheck: async (): Promise<{ status: string }> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {
        method: 'GET',
      });
      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};

export default resumeApi; 