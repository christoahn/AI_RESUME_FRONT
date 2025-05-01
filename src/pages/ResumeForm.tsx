import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/ResumeForm.css';
import resumeApi from '../api/resumeApi';

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

const ResumeForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    address: ''
  });
  
  const [educationList, setEducationList] = useState<Education[]>([{
    name: '',
    degree: '',
    major: '',
    duration: '',
    gpa: ''
  }]);
  
  const [workExperienceList, setWorkExperienceList] = useState<WorkExperience[]>([{
    name: '',
    position: '',
    duration: '',
    keywords: ''
  }]);
  
  const [projectList, setProjectList] = useState<Project[]>([{
    name: '',
    position: '',
    duration: '',
    keywords: ''
  }]);
  
  const [researchesList, setResearchesList] = useState<Research[]>([{
    name: '',
    duration: '',
    keywords: ''
  }]);
  
  const [skills, setSkills] = useState('');

  // Step titles
  const steps = [
    "Basic Information",
    "Education",
    "Work Experience",
    "Projects",
    "Researches",
    "Skills"
  ];

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBasicInfo((prev: BasicInfo) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedEducation = [...educationList];
    updatedEducation[index] = { ...updatedEducation[index], [name]: value };
    setEducationList(updatedEducation);
  };
  
  const handleWorkExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedWorkExperience = [...workExperienceList];
    updatedWorkExperience[index] = { ...updatedWorkExperience[index], [name]: value };
    setWorkExperienceList(updatedWorkExperience);
  };

  const handleProjectChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedProjects = [...projectList];
    updatedProjects[index][name as keyof Omit<Project, 'description'>] = value;
    setProjectList(updatedProjects);
  };
  
  const handleResearchChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedResearches = [...researchesList];
    updatedResearches[index] = { ...updatedResearches[index], [name]: value };
    setResearchesList(updatedResearches);
  };
  
  const addEducation = () => {
    setEducationList([...educationList, {
      name: '',
      degree: '',
      major: '',
      duration: '',
      gpa: ''
    }]);
  };
  
  const removeEducation = (index: number) => {
    if (educationList.length > 1) {
      const updatedEducation = [...educationList];
      updatedEducation.splice(index, 1);
      setEducationList(updatedEducation);
    }
  };
  
  const addWorkExperience = () => {
    setWorkExperienceList([...workExperienceList, {
      name: '',
      position: '',
      duration: '',
      keywords: ''
    }]);
  };
  
  const removeWorkExperience = (index: number) => {
    if (workExperienceList.length > 1) {
      const updatedWorkExperience = [...workExperienceList];
      updatedWorkExperience.splice(index, 1);
      setWorkExperienceList(updatedWorkExperience);
    }
  };
  
  const addProject = () => {
    setProjectList([...projectList, {
      name: '',
      position: '',
      duration: '',
      keywords: ''
    }]);
  };
  
  const removeProject = (index: number) => {
    if (projectList.length > 1) {
      const updatedProjects = [...projectList];
      updatedProjects.splice(index, 1);
      setProjectList(updatedProjects);
    }
  };

  const addResearch = () => {
    setResearchesList([...researchesList, {
      name: '',
      duration: '',
      keywords: ''
    }]);
  };
  
  const removeResearch = (index: number) => {
    if (researchesList.length > 1) {
      const updatedResearches = [...researchesList];
      updatedResearches.splice(index, 1);
      setResearchesList(updatedResearches);
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!basicInfo.name || !basicInfo.email || !basicInfo.phone || !basicInfo.address) {
        alert('Please fill in all basic information fields');
        return;
      }
    } else if (currentStep === 1) {
      if (educationList.length === 0) {
        alert('Please add at least one education entry');
        return;
      }
    } else if (currentStep === 2) {
      if (workExperienceList.length === 0) {
        alert('Please add at least one work experience entry');
        return;
      }
    } else if (currentStep === 3) {
      if (researchesList.length === 0) {
        alert('Please add at least one research entry');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(current => Math.max(current - 1, 0));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Form submission started");
      
      // Create properly formatted data objects for backend
      const projectsObj: Record<string, any> = {};
      projectList.forEach((proj, index) => {
        if (proj.name) {
          projectsObj[`project${index + 1}`] = {
            name: proj.name,
            position: proj.position || '',
            duration: proj.duration || '',
            description: proj.keywords || ''
          };
        }
      });
      
      const jobsObj: Record<string, any> = {};
      workExperienceList.forEach((job, index) => {
        if (job.name) {
          jobsObj[`job${index + 1}`] = {
            name: job.name,
            position: job.position || '',
            duration: job.duration || '',
            description: job.keywords || ''
          };
        }
      });
      
      const researchesObj: Record<string, any> = {};
      researchesList.forEach((research, index) => {
        if (research.name) {
          researchesObj[`research${index + 1}`] = {
            name: research.name,
            duration: research.duration || '',
            description: research.keywords || ''
          };
        }
      });
      
      const educationsObj: Record<string, any> = {};
      educationList.forEach((edu, index) => {
        if (edu.name) {
          educationsObj[`education${index + 1}`] = {
            school_name: edu.name,
            degree: edu.degree || '',
            major: edu.major || '',
            duration: edu.duration || '',
            gpa: edu.gpa || ''
          };
        }
      });
      
      // Create data structure expected by the API
      const formattedData = {
        name: basicInfo.name,
        email: basicInfo.email,
        phone: basicInfo.phone,
        address: basicInfo.address || '',
        projects: projectsObj,
        jobs: jobsObj,
        researches: researchesObj,
        educations: educationsObj,
        skills: skills
      };
      
      console.log("Sending data to API:", formattedData);
      
      const data = await resumeApi.generateResume(formattedData);
      console.log('Resume generation API response:', data);
      
      if (data.status === 'success' && data.data) {
        // Get resume_id from the response data
        const resumeId = data.data.resume_id;
        console.log("Generated resume ID:", resumeId);
        
        if (!resumeId) {
          alert('No resume ID found!');
          return;
        }
        
        try {
          // Try navigating to the resume editor route with ID parameter
          console.log(`Trying to navigate to resume_editor/${resumeId}`);
          navigate(`/resume_editor/${resumeId}`);
        } catch (navError) {
          console.error("Navigation error:", navError);
          
          // Fallback to the query parameter version if the URL parameter version fails
          console.log(`Fallback: navigating to resume_preview?resume_id=${resumeId}`);
          navigate(`/resume_preview?resume_id=${resumeId}`);
        }
      } else {
        console.error("API response error:", data);
        throw new Error(data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('An error occurred while generating your resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return basicInfo.name && basicInfo.email;
      case 1: 
        return true; 
      case 2: 
        return true; 
      case 3: 
        return true;
      case 4: 
        return true;
      case 5: 
        return skills.trim() !== '';
      default:
        return true;
    }
  };


  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={basicInfo.name}
                onChange={handleBasicInfoChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={basicInfo.email}
                onChange={handleBasicInfoChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={basicInfo.phone}
                onChange={handleBasicInfoChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn URL</label>
              <input 
                type="url" 
                id="linkedin" 
                name="linkedin" 
                value={basicInfo.linkedin}
                onChange={handleBasicInfoChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="portfolio">Portfolio URL (Optional)</label>
              <input 
                type="url" 
                id="portfolio" 
                name="portfolio" 
                value={basicInfo.portfolio}
                onChange={handleBasicInfoChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address (Optional)</label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                value={basicInfo.address}
                onChange={handleBasicInfoChange}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="form-section">
            <h2>Education</h2>
            {educationList.map((edu, index) => (
              <div key={index} className="dynamic-section">
                <h3>Education #{index + 1}</h3>
                
                <div className="form-group">
                  <label htmlFor={`school-${index}`}>School/University</label>
                  <input 
                    type="text" 
                    id={`school-${index}`} 
                    name="name" 
                    value={edu.name}
                    onChange={(e) => handleEducationChange(index, e)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`degree-${index}`}>Degree</label>
                  <input 
                    type="text" 
                    id={`degree-${index}`} 
                    name="degree" 
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, e)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`major-${index}`}>Major/Field of Study</label>
                  <input 
                    type="text" 
                    id={`major-${index}`} 
                    name="major" 
                    value={edu.major}
                    onChange={(e) => handleEducationChange(index, e)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`duration-${index}`}>Duration</label>
                  <input 
                    type="text" 
                    id={`duration-${index}`} 
                    name="duration" 
                    value={edu.duration}
                    onChange={(e) => handleEducationChange(index, e)}
                    placeholder="MM/YYYY - MM/YYYY"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`gpa-${index}`}>GPA (Optional)</label>
                  <input 
                    type="text" 
                    id={`gpa-${index}`} 
                    name="gpa" 
                    value={edu.gpa}
                    onChange={(e) => handleEducationChange(index, e)}
                  />
                </div>
                
                {educationList.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removeEducation(index)}>
                    Remove Education
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addEducation}>
              Add Another Education
            </button>
          </div>
        );
      case 2:
        return (
          <div className="form-section">
            <h2>Work Experience (Optional)</h2>
            <p>Add your work experience details. If you don't have any work experience yet, you can skip this section.</p>
            {workExperienceList.map((exp, index) => (
              <div key={index} className="dynamic-section">
                <h3>Experience #{index + 1}</h3>
                
                <div className="form-group">
                  <label htmlFor={`company-${index}`}>Company/Organization</label>
                  <input 
                    type="text" 
                    id={`company-${index}`} 
                    name="name" 
                    value={exp.name}
                    onChange={(e) => handleWorkExperienceChange(index, e)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`position-${index}`}>Position</label>
                  <input 
                    type="text" 
                    id={`position-${index}`} 
                    name="position" 
                    value={exp.position}
                    onChange={(e) => handleWorkExperienceChange(index, e)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`duration-${index}`}>Duration</label>
                  <input 
                    type="text" 
                    id={`duration-${index}`} 
                    name="duration" 
                    value={exp.duration}
                    onChange={(e) => handleWorkExperienceChange(index, e)}
                    placeholder="MM/YYYY - MM/YYYY"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`keywords-${index}`}>Keywords</label>
                  <textarea 
                    id={`keywords-${index}`} 
                    name="keywords" 
                    value={exp.keywords}
                    onChange={(e) => handleWorkExperienceChange(index, e)}
                    placeholder="Enter keywords related to your job (e.g., Python, Project Management, Customer Service)"
                    required 
                  />
                </div>
                
                {workExperienceList.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removeWorkExperience(index)}>
                    Remove Experience
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addWorkExperience}>
              Add Another Experience
            </button>
          </div>
        );
      case 3:
        return (
          <div className="form-section">
            <h2>Projects</h2>
            {projectList.map((proj, index) => (
              <div key={index} className="dynamic-section">
                <h3>Project #{index + 1}</h3>
                <div className="form-group">
                  <label htmlFor={`title-${index}`}>Title</label>
                  <input 
                    type="text" 
                    id={`title-${index}`} 
                    name="name" 
                    value={proj.name}
                    onChange={(e) => handleProjectChange(index, e)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`position-${index}`}>Position</label>
                  <input 
                    type="text" 
                    id={`position-${index}`} 
                    name="position" 
                    value={proj.position}
                    onChange={(e) => handleProjectChange(index, e)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`duration-${index}`}>Duration</label>
                  <input 
                    type="text" 
                    id={`duration-${index}`} 
                    name="duration" 
                    value={proj.duration}
                    onChange={(e) => handleProjectChange(index, e)}
                    placeholder="MM/YYYY - MM/YYYY"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`keywords-${index}`}>Keywords</label>
                  <input 
                    type="text" 
                    id={`keywords-${index}`} 
                    name="keywords" 
                    value={proj.keywords}
                    onChange={(e) => handleProjectChange(index, e)}
                    placeholder="Enter keywords related to your project (e.g., React, Machine Learning, UI/UX)"
                    required 
                  />
                </div>
                {projectList.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removeProject(index)}>
                    Remove Project
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addProject}>
              Add Another Project
            </button>
          </div>
        );
      case 4:
        return (
          <div className="form-section">
            <h2>Researches (Optional)</h2>
            <p>Add your research experience details. If you don't have any research experience, you can skip this section.</p>
            {researchesList.map((res, index) => (
              <div key={index} className="dynamic-section">
                <h3>Research #{index + 1}</h3>
                <div className="form-group">
                  <label htmlFor={`title-${index}`}>Title</label>
                  <input
                    type="text"
                    id={`title-${index}`}
                    name="name"
                    value={res.name}
                    onChange={(e) => handleResearchChange(index, e)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`research_duration-${index}`}>Research Duration</label>
                  <input
                    type="text"
                    id={`research_duration-${index}`}
                    name="duration"
                    value={res.duration}
                    onChange={(e) => handleResearchChange(index, e)}
                    placeholder="MM/YYYY - MM/YYYY"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`keywords-${index}`}>Keywords</label>
                  <input
                    type="text"
                    id={`keywords-${index}`}
                    name="keywords"
                    value={res.keywords}
                    onChange={(e) => handleResearchChange(index, e)}
                    placeholder="Enter keywords related to your research"
                    required
                  />
                </div>
                {researchesList.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removeResearch(index)}>
                    Remove Research
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addResearch}>
              Add Another Research
            </button>
          </div>
        );
      case 5:
        return (
          <div className="form-section">
            <h2>Skills</h2>
            <div className="form-group">
              <label htmlFor="skills">Skills</label>
              <textarea
                id="skills"
                name="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Enter your skills, separated by commas (e.g., Python, JavaScript, Communication, Leadership)"
                required
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="form-container">
      <h1>Create Your AI-Powered Resume</h1>
      <div className="progress-steps">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            onClick={() => index < currentStep && setCurrentStep(index)}
          >
            <span className="step-number">{index + 1}</span>
            <span className="step-name">{step}</span>
          </div>
        ))}
      </div>
      {loading ? (
        <div className="spinner">
          <div className="spinner-circle"></div>
          <div style={{marginTop: '20px', fontWeight: 'bold'}}>Generating Resume...</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {renderStep()}
          <div className="button-group">
            {currentStep > 0 && (
              <button 
                type="button" 
                className="prev-btn" 
                onClick={prevStep}
              >
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button 
                type="button" 
                className="next-btn" 
                onClick={handleNext}
                disabled={!validateCurrentStep()}
              >
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading || !validateCurrentStep()}
              >
                {loading ? 'Generating...' : 'Generate Resume'}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default ResumeForm;