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
  school: string;
  degree: string;
  major: string;
  duration: string;
  gpa?: string;
}

interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  keywords: string;
}

interface Project {
  title: string;
  role: string;
  duration: string;
  keywords: string;
}

interface ResumeData {
  basic_info: BasicInfo;
  education: Education[] | Record<string, Education>;
  work_experience: WorkExperience[] | Record<string, WorkExperience>;
  projects: Project[] | Record<string, Project>;
  skills: string;
}

const API_BASE_URL = '/api/v1';

const resumeApi = {
  generateResume: async (data: ResumeData) => {
    try {
      const { basic_info, work_experience, projects } = data;
      
      const jobs: Record<string, any> = {};
      const formattedProjects: Record<string, any> = {};
      
      const processItems = <T extends Record<string, any>>(
        items: T[] | Record<string, T>,
        keyPrefix: string,
        keyMap: Record<string, string>,
        target: Record<string, any>
      ) => {
        if (typeof items === 'object' && !Array.isArray(items)) {
          Object.entries(items).forEach(([_, item], index) => {
            const formattedItem: Record<string, any> = {};
            Object.entries(keyMap).forEach(([origKey, newKey]) => {
              formattedItem[newKey] = item[origKey] || null;
            });
            target[`${keyPrefix}${index + 1}`] = formattedItem;
          });
        } else if (Array.isArray(items)) {
          items.forEach((item, index) => {
            const formattedItem: Record<string, any> = {};
            Object.entries(keyMap).forEach(([origKey, newKey]) => {
              formattedItem[newKey] = item[origKey] || null;
            });
            target[`${keyPrefix}${index + 1}`] = formattedItem;
          });
        }
      };
      
      processItems<WorkExperience>(work_experience, 'job', {
        'company': 'company_name',
        'duration': 'duration',
        'position': 'position',
        'keywords': 'keywords'
      }, jobs);
      
      processItems<Project>(projects, 'project', {
        'title': 'project_name',
        'duration': 'duration',
        'role': 'role',
        'keywords': 'keywords'
      }, formattedProjects);
      
      const requestData = {
        'name': basic_info.name || null,
        'phone': basic_info.phone || null,
        'email': basic_info.email || null,
        'jobs': jobs,
        'projects': formattedProjects,
      };
      
      const response = await axios.post(`${API_BASE_URL}/resume/generate/`, requestData);
      return response.data;
    } catch (error) {
      console.error('Error generating resume:', error);
      throw error;
    }
  },

  generatePdf: async (html: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/resume/export/pdf/`, { html }, {
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
      const response = await axios.post(`${API_BASE_URL}/resume/export/docx/`, { html }, {
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
  }
};

export default resumeApi; 