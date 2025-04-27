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
  action?: string;
}

interface ChunkData {
  type: 'basic_info' | 'education' | 'work_experience' | 'project';
  data: BasicInfo | Education | WorkExperience | Project;
}

const resumeApi = {
  generateResume: async (data: ResumeData) => {
    try {
      const { basic_info, work_experience, projects } = data;
      
      const jobs: Record<string, any> = {};
      if (typeof work_experience === 'object' && !Array.isArray(work_experience)) {
        Object.entries(work_experience).forEach(([key, job], index) => {
          jobs[`job${index + 1}`] = {
            'company_name': job.company || null,
            'duration': job.duration || null,
            'position': job.position || null,
            'keywords': job.keywords || null
          };
        });
      } else if (Array.isArray(work_experience)) {
        work_experience.forEach((job, index) => {
          jobs[`job${index + 1}`] = {
            'company_name': job.company || null,
            'duration': job.duration || null,
            'position': job.position || null,
            'keywords': job.keywords || null
          };
        });
      }
      
      const formattedProjects: Record<string, any> = {};
      if (typeof projects === 'object' && !Array.isArray(projects)) {
        Object.entries(projects).forEach(([key, project], index) => {
          formattedProjects[`project${index + 1}`] = {
            'project_name': project.title || null,
            'duration': project.duration || null,
            'role': project.role || null,
            'keywords': project.keywords || null
          };
        });
      } else if (Array.isArray(projects)) {
        projects.forEach((project, index) => {
          formattedProjects[`project${index + 1}`] = {
            'project_name': project.title || null,
            'duration': project.duration || null,
            'role': project.role || null,
            'keywords': project.keywords || null
          };
        });
      }
      const requestData = {
        'name': basic_info.name || null,
        'phone': basic_info.phone || null,
        'email': basic_info.email || null,
        'jobs': jobs,
        'projects': formattedProjects,
        'action': 'generate_resume'
      };
      
      const response = await axios.post('/api/generate-resume', requestData);
      return response.data;
    } catch (error) {
      console.error('Error generating resume:', error);
      throw error;
    }
  },

  addChunk: async (data: ChunkData) => {
    try {
      const response = await axios.post('/api/add-chunk', data);
      return response.data;
    } catch (error) {
      console.error('Error adding chunk:', error);
      throw error;
    }
  },

  generatePdf: async (html: string) => {
    try {
      const response = await axios.post('/api/generate-pdf', { html }, {
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
      const response = await axios.post('/api/generate-docx', { html }, {
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
      const response = await axios.post('/api/chat', {
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
      const response = await axios.get('/api/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
};

export default resumeApi; 