import axios from 'axios';

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

const API_BASE_URL = 'http://localhost:8000/api';

// 값이 비어있는지 확인하는 함수
const isEmpty = (value: any): boolean => {
  return value === '' || value === undefined || value === null;
};

// 값을 적절히 변환하는 함수 (빈 값은 null로 변환)
const formatValue = (value: any): any => {
  return isEmpty(value) ? null : value;
};

const resumeApi = {
  generateResume: async (data: ResumeData) => {
    try {
      const { basic_info, education, work_experience, projects, researches } = data;
      
      // 작업 경험 데이터 변환
      const jobs: Record<string, any> = {};
      if (typeof work_experience === 'object' && !Array.isArray(work_experience)) {
        Object.entries(work_experience).forEach(([key, job], index) => {
          jobs[`job${index + 1}`] = {
            'name': formatValue(job.name),
            'duration': formatValue(job.duration),
            'position': formatValue(job.position),
            'keywords': formatValue(job.keywords)
          };
        });
      } else if (Array.isArray(work_experience)) {
        work_experience.forEach((job, index) => {
          jobs[`job${index + 1}`] = {
            'name': formatValue(job.name),
            'duration': formatValue(job.duration),
            'position': formatValue(job.position),
            'keywords': formatValue(job.keywords)
          };
        });
      }
      
      // 프로젝트 데이터 변환
      const formattedProjects: Record<string, any> = {};
      if (typeof projects === 'object' && !Array.isArray(projects)) {
        Object.entries(projects).forEach(([key, project], index) => {
          formattedProjects[`project${index + 1}`] = {
            'name': formatValue(project.name),
            'duration': formatValue(project.duration),
            'position': formatValue(project.position),
            'keywords': formatValue(project.keywords)
          };
        });
      } else if (Array.isArray(projects)) {
        projects.forEach((project, index) => {
          formattedProjects[`project${index + 1}`] = {
            'name': formatValue(project.name),
            'duration': formatValue(project.duration),
            'position': formatValue(project.position),
            'keywords': formatValue(project.keywords)
          };
        });
      }
      
      // 연구 경력 데이터 변환
      const formattedResearches: Record<string, any> = {};
      if (typeof researches === 'object' && !Array.isArray(researches)) {
        Object.entries(researches).forEach(([key, research], index) => {
          formattedResearches[`research${index + 1}`] = {
            'name': formatValue(research.name),
            'duration': formatValue(research.duration),
            'keywords': formatValue(research.keywords)
          };
        });
      } else if (Array.isArray(researches)) {
        researches.forEach((research, index) => {
          formattedResearches[`research${index + 1}`] = {
            'name': formatValue(research.name),
            'duration': formatValue(research.duration),
            'keywords': formatValue(research.keywords)
          };
        });
      }
      
      // 교육 데이터 변환
      const formattedEducation: Record<string, any> = {};
      if (typeof education === 'object' && !Array.isArray(education)) {
        Object.entries(education).forEach(([key, edu], index) => {
          formattedEducation[`education${index + 1}`] = {
            'name': formatValue(edu.name),
            'degree': formatValue(edu.degree),
            'major': formatValue(edu.major),
            'duration': formatValue(edu.duration),
            'gpa': formatValue(edu.gpa)
          };
        });
      } else if (Array.isArray(education)) {
        education.forEach((edu, index) => {
          formattedEducation[`education${index + 1}`] = {
            'name': formatValue(edu.name),
            'degree': formatValue(edu.degree),
            'major': formatValue(edu.major),
            'duration': formatValue(edu.duration),
            'gpa': formatValue(edu.gpa)
          };
        });
      }
      
      // 백엔드 API 요청 데이터 구성 (모든 키는 복수형, 소문자)
      const requestData = {
        'name': formatValue(basic_info.name),
        'phone': formatValue(basic_info.phone),
        'email': formatValue(basic_info.email),
        'linkedin': formatValue(basic_info.linkedin),
        'portfolio': formatValue(basic_info.portfolio),
        'address': formatValue(basic_info.address),
        'jobs': jobs,
        'projects': formattedProjects,
        'researches': formattedResearches,
        'educations': formattedEducation,
        'skills': formatValue(data.skills),
        'action': 'generate_resume'
      };
      
      const response = await axios.post(`${API_BASE_URL}/basicinfos/`, requestData);
      console.log("Response.data 값: ", response.data)
      return response.data;
    } catch (error) {
      console.error('Error generating resume:', error);
      throw error;
    }
  },

  // Get Stored resume from database at third page
  getResume: async (resumeId: number) => {
    const response = await fetch(`${API_BASE_URL}/resume/resume_preview?resume_id=${resumeId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch resume');
    }
    return response.json();
  },

  generatePdf: async (html: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/resume_preview/`, { html }, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  },

  generateDocx: async (html: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/resume_preview/`, { html }, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating DOCX:', error);
      throw error;
    }
  },

  chatWithAI: async (message: string, resumeHtml: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/chat/`, {
        message,
        resume_html: resumeHtml
      });
      return response.data;
    } catch (error) {
      console.error('Error chatting with AI:', error);
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health/`);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  updateResume: async (resumeId: number, updatedData: any) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/resume_preview`, updatedData, { params: { resume_id: resumeId } });
      return response.data;
    } catch (err) {
      console.error('Error updating resume', err);
      throw err;
    }
  }
};

export default resumeApi; 