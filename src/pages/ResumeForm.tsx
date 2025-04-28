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
  position: string;
  duration: string;
  keywords: string;
}

interface Research {
  title: string;
  research_duration: string;
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
    school: '',
    degree: '',
    major: '',
    duration: '',
    gpa: ''
  }]);
  
  const [workExperienceList, setWorkExperienceList] = useState<WorkExperience[]>([{
    company: '',
    position: '',
    duration: '',
    keywords: ''
  }]);
  
  const [projectList, setProjectList] = useState<Project[]>([{
    title: '',
    position: '',
    duration: '',
    keywords: ''
  }]);
  
  const [researchesList, setResearchesList] = useState<Research[]>([{
    title: '',
    research_duration: '',
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
      school: '',
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
      company: '',
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
      title: '',
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
      title: '',
      research_duration: '',
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

  const nextStep = () => {
    setCurrentStep(current => Math.min(current + 1, steps.length - 1));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(current => Math.max(current - 1, 0));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const educationObj: Record<string, Education> = {};
      educationList.forEach((edu, index) => {
        educationObj[`education${index + 1}`] = edu;
      });

      const workExperienceObj: Record<string, WorkExperience> = {};
      workExperienceList.forEach((job, index) => {
        workExperienceObj[`job${index + 1}`] = job;
      });

      const projectsObj: Record<string, Project> = {};
      projectList.forEach((proj, index) => {
        projectsObj[`project${index + 1}`] = proj;
      });

      const researchesObj: Record<string, Research> = {};
      researchesList.forEach((res, index) => {
        researchesObj[`research${index + 1}`] = res;
      });

      const formattedData = {
        basic_info: basicInfo,
        education: educationObj, 
        work_experience: workExperienceObj, 
        projects: projectsObj,
        researches: researchesObj,
        skills: skills
      };
      
      localStorage.setItem('basic_info', JSON.stringify(basicInfo));
      localStorage.setItem('education', JSON.stringify(educationObj)); 
      localStorage.setItem('work_experience', JSON.stringify(workExperienceObj)); 
      localStorage.setItem('projects', JSON.stringify(projectsObj)); 
      localStorage.setItem('researches', JSON.stringify(researchesObj));
      localStorage.setItem('skills', skills);

      const response = await resumeApi.generateResume(formattedData);

      if (response.status === 'success') {
        localStorage.setItem('resumeHTML', response.result);
        navigate('/resume');
      } else {
        alert('Failed to generate resume: ' + response.message);
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Error generating resume. Please try again.');
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
        return projectList.every(proj => proj.title && proj.position && proj.duration && proj.keywords);
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
                    name="school" 
                    value={edu.school}
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
                    name="company" 
                    value={exp.company}
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
                    name="title" 
                    value={proj.title}
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
                    name="title"
                    value={res.title}
                    onChange={(e) => handleResearchChange(index, e)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`research_duration-${index}`}>Research Duration</label>
                  <input
                    type="text"
                    id={`research_duration-${index}`}
                    name="research_duration"
                    value={res.research_duration}
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
                onClick={nextStep}
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