import axios from 'axios';
import { ResumeData, ResumeDataResponse, ApiResponse, ChatResponse } from '../types';
import { fetchWithTimeout, handleApiError } from '../utils/api';

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
      console.log("Original data:", data);
      
      // Create a properly formatted request with the correct field names that match backend expectations
      const requestData: {
        name: string | null;
        phone: string | null;
        email: string | null;
        address: string | null;
        projects: Record<string, any>;
        jobs: Record<string, any>;
        researches: Record<string, any>;
        educations: Record<string, any>;
      } = {
        name: formatValue(data.name),
        phone: formatValue(data.phone),
        email: formatValue(data.email),
        address: formatValue(data.address),
        projects: {},
        jobs: {},
        researches: {},
        educations: {}
      };
      
      // Format projects correctly
      if (Array.isArray(data.projects)) {
        data.projects.forEach((proj, index) => {
          requestData.projects[`project${index + 1}`] = {
            title: formatValue(proj.name),
            duration: formatValue(proj.duration),
            description: formatValue(proj.position || proj.description || "") // Use position or description
          };
        });
      }
      
      // Format jobs correctly
      if (Array.isArray(data.jobs)) {
        data.jobs.forEach((job, index) => {
          requestData.jobs[`job${index + 1}`] = {
            company_name: formatValue(job.name),
            position: formatValue(job.position),
            duration: formatValue(job.duration),
            description: formatValue(job.description || job.keywords || "")
          };
        });
      }
      
      // Format researches correctly
      if (Array.isArray(data.researchs)) {
        data.researchs.forEach((research, index) => {
          requestData.researches[`research${index + 1}`] = {
            title: formatValue(research.name),
            duration: formatValue(research.duration),
            description: formatValue(research.description || research.keywords || "")
          };
        });
      }
      
      // Format educations correctly
      if (Array.isArray(data.educations)) {
        data.educations.forEach((edu, index) => {
          requestData.educations[`education${index + 1}`] = {
            school_name: formatValue(edu.name),
            degree: formatValue(edu.degree),
            major: formatValue(edu.major),
            duration: formatValue(edu.duration),
            gpa: formatValue(edu.gpa)
          };
        });
      }
      
      console.log("Formatted request data:", requestData);
      
      try {
        const response = await fetchWithTimeout('resume', {
          method: 'POST',
          body: JSON.stringify(requestData),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const responseData = await response.json();
        console.log("API Response:", responseData);
        return responseData;
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        return {
          status: 'error',
          message: `Connection error: ${handleApiError(fetchError)}`
        };
      }
    } catch (error) {
      console.error("General error:", error);
      return {
        status: 'error',
        message: `Error generating resume: ${handleApiError(error)}`
      };
    }
  },

  getResume: async (id: number): Promise<ApiResponse<ResumeDataResponse>> => {
    try {
      const response = await fetchWithTimeout(`resume/${id}`, {
        method: 'GET',
      });
      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateResume: async (id: number, resumeData: ResumeData): Promise<ApiResponse<ResumeDataResponse>> => {
    try {
      const response = await fetchWithTimeout(`resume/${id}`, {
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
      const response = await fetchWithTimeout('resume/docx', {
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
      const response = await fetchWithTimeout('chat', {
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
      const response = await fetchWithTimeout('health', {
        method: 'GET',
      });
      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};

export default resumeApi; 