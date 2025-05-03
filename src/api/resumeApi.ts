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
  coursework?: string;
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
//청크 
interface ChunkData {
  id: number;
  name: string;
}
//청크
interface ChunksByType {
  projects: ChunkData[];
  jobs: ChunkData[];
  researches: ChunkData[];
  educations: ChunkData[];
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


const isEmpty = (value: any): boolean => {
  return value === '' || value === undefined || value === null;
};


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
            // 'description': formatValue(job.description),
            'keywords': formatValue(job.keywords)
          };
        });
      } else if (Array.isArray(work_experience)) {
        work_experience.forEach((job, index) => {
          jobs[`job${index + 1}`] = {
            'name': formatValue(job.name),
            'duration': formatValue(job.duration),
            'position': formatValue(job.position),
            // 'description': formatValue(job.description),
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
            // 'description': formatValue(project.description),
            'keywords': formatValue(project.keywords)
          };
        });
      } else if (Array.isArray(projects)) {
        projects.forEach((project, index) => {
          formattedProjects[`project${index + 1}`] = {
            'name': formatValue(project.name),
            'duration': formatValue(project.duration),
            'position': formatValue(project.position),
            // 'description': formatValue(project.description),
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
            // 'description': formatValue(research.description),
            'keywords': formatValue(research.keywords)
          };
        });
      } else if (Array.isArray(researches)) {
        researches.forEach((research, index) => {
          formattedResearches[`research${index + 1}`] = {
            'name': formatValue(research.name),
            'duration': formatValue(research.duration),
            // 'description': formatValue(research.description),
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
            'gpa': formatValue(edu.gpa),
            'coursework': formatValue(edu.coursework),
            // 'description': formatValue(edu.description)
          };
        });
      } else if (Array.isArray(education)) {
        education.forEach((edu, index) => {
          formattedEducation[`education${index + 1}`] = {
            'name': formatValue(edu.name),
            'degree': formatValue(edu.degree),
            'major': formatValue(edu.major),
            'duration': formatValue(edu.duration),
            'gpa': formatValue(edu.gpa),
            'coursework': formatValue(edu.coursework),
            // 'description': formatValue(edu.description)
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
      
      const response = await axios.post(`${API_BASE_URL}/resume/basicinfos/`, requestData);
      console.log("Response.data 값: ", response.data)
      return response.data;
    } catch (error) {
      console.error('Error generating resume:', error);
      throw error;
    }
  },

  
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
        responseType: 'blob',
        headers: {
          'X-Format-Type': 'pdf'
        }
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
        responseType: 'blob',
        headers: {
          'X-Format-Type': 'docx'
        }
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
      
      
      const data = response.data;
      
      
      if (!data) {
        return {
          status: 'error',
          response: 'No response received from server.'
        };
      }
      
      
      if (data.error) {
        return {
          status: 'error',
          response: data.error
        };
      }
      
      
      if (data.updated_json) {
        try {
          
          if (typeof data.updated_json === 'string') {
            data.updated_json = JSON.parse(data.updated_json);
          }
          
          
          if (!data.updated_json.name || !data.updated_json.email) {
            console.warn('Invalid resume JSON structure detected');
            
            delete data.updated_json;
          }
        } catch (parseError) {
          console.error('Error parsing updated_json:', parseError);
          
          delete data.updated_json;
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error chatting with AI:', error);
      return {
        status: 'error',
        response: 'Failed to connect to the AI service. Please try again later.'
      };
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
  },
  //청크
  // 이력서의 편집 가능한 청크 목록 가져오는 함수
  getResumeChunks: async (resumeId: number): Promise<ChunksByType> => {
    try {
      // 청크 목록을 가져오는 API 호출
      const response = await axios.get(`${API_BASE_URL}/resume/chunk_edit/?resume_id=${resumeId}`);
      
      // 성공적으로 응답을 받으면 청크 목록 반환
      if (response.data && response.data.status === 'success') {
        return response.data.chunks as ChunksByType;
      } else {
        // 오류 발생 시 빈 객체 반환
        console.error('Error fetching resume chunks:', response.data?.error || 'Unknown error');
        return {
          projects: [],
          jobs: [],
          researches: [],
          educations: []
        };
      }
    } catch (error) {
      console.error('Error fetching resume chunks:', error);
      // 오류 발생 시 빈 객체 반환
      return {
        projects: [],
        jobs: [],
        researches: [],
        educations: []
      };
    }
  },

  // 특정 청크를 AI와 채팅을 통해 편집하는 함수
  editChunkWithAI: async (
    resumeId: number,
    chunkType: 'projects' | 'jobs' | 'researches' | 'educations',
    chunkId: number,
    message: string
  ) => {
    try {
      // 청크 편집 요청 데이터
      const requestData = {
        chunk_type: chunkType,
        chunk_id: chunkId,
        message: message
      };
      
      // 청크 편집 API 호출
      const response = await axios.post(
        `${API_BASE_URL}/resume/chunk_edit/`, 
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // 응답 확인 및 처리
      if (response.data && response.data.status === 'success') {
        return {
          status: 'success',
          message: response.data.message || 'Chunk updated successfully',
          updatedDescription: response.data.updated_description
        };
      } else {
        // 오류 처리
        return {
          status: 'error',
          message: response.data?.error || 'Failed to update chunk'
        };
      }
    } catch (error: any) {
      console.error('Error editing chunk:', error);
      return {
        status: 'error',
        message: error.response?.data?.error || error.message || 'An error occurred while updating the chunk'
      };
    }
  },
};

export default resumeApi; 