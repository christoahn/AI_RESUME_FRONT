import React from 'react';
import '../assets/ResumePreview.css';

interface Project {
  title?: string;
  name?: string;
  position?: string;
  duration: string;
  description?: string | string[];
}

interface Job {
  company_name?: string;
  name?: string;
  position?: string;
  duration: string;
  description?: string | string[];
}

interface Research {
  title?: string;
  name?: string;
  duration: string;
  description?: string | string[];
}

interface Education {
  school_name?: string;
  name?: string;
  degree: string;
  duration: string;
  major: string;
  gpa?: string;
  description?: string | string[];
}

interface ResumeData {
  name: string;
  phone: string;
  email: string;
  address: string;
  projects?: Project[];
  jobs?: Job[];
  researchs?: Research[];
  educations?: Education[];
}

interface ResumePreviewProps {
  resumeData: ResumeData;
  handleDownloadPDF: () => void;
  handleDownloadDOCX: () => void;
}

// Helper function to safely process description fields
const processDescription = (desc: string | string[] | undefined): string | string[] => {
  if (!desc) return '';
  
  if (typeof desc === 'string') {
    if (desc === '[]' || desc === '[' || desc === ']') {
      return '';
    }
    if (desc.trim().startsWith('[')) {
      try {
        return JSON.parse(desc);
      } catch (e1) {
        try {
          return JSON.parse(desc.replace(/'/g, '"'));
        } catch (e2) {
          return desc.replace(/^\[|\]$/g, '').replace(/\[|\]/g, '');
        }
      }
    }
  }
  return desc;
};

const ResumePreview = (props: ResumePreviewProps) => {
  const { resumeData, handleDownloadPDF, handleDownloadDOCX } = props;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    alert('Link copied to clipboard!');
  };

  return (
    <div className="resume-preview-container">
      <div className="preview-header">
        <h2>Resume Preview</h2>
        <div className="preview-actions">
          <button className="action-btn pdf" onClick={handleDownloadPDF}>📄 PDF</button>
          <button className="action-btn docx" onClick={handleDownloadDOCX}>📝 DOCX</button>
          <button className="action-btn print" onClick={handlePrint}>🖨️ Print</button>
          <button className="action-btn share" onClick={handleCopyLink}>🔗 Share</button>
        </div>
      </div>
      <div className="preview-content">
        <div className="resume-document">
          <h1>{resumeData.name}</h1>
          <p className="contact-info">Email: {resumeData.email} | Phone: {resumeData.phone} | Address: {resumeData.address}</p>

          {resumeData.educations && resumeData.educations.length > 0 && (
            <section>
              <h2>Education</h2>
              {resumeData.educations.map((edu, idx) => {
                const desc = processDescription(edu.description);
                
                return (
                  <div key={idx} className="education-entry">
                    <h3>{edu.name}</h3>
                    <div className="position-duration">
                      <span className="position">{edu.degree}, Major: {edu.major}</span>
                      <span className="duration">{edu.duration}</span>
                    </div>
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    {Array.isArray(desc) ? (
                      <ul>
                        {desc.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    ) : (
                      <p>{desc}</p>
                    )}
                  </div>
                );
              })}
            </section>
          )}

          {resumeData.jobs && resumeData.jobs.length > 0 && (
            <section>
              <h2>Work Experience</h2>
              {resumeData.jobs.map((job, idx) => {
                const desc = processDescription(job.description);
                
                return (
                  <div key={idx} className="work-entry">
                    <h3>{job.name}</h3>
                    <div className="position-duration">
                      <span className="position">{job.position}</span>
                      <span className="duration">{job.duration}</span>
                    </div>
                    {Array.isArray(desc) ? (
                      <ul>
                        {desc.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    ) : (
                      <p>{desc}</p>
                    )}
                  </div>
                );
              })}
            </section>
          )}
          
          {resumeData.projects && resumeData.projects.length > 0 && (
            <section>
              <h2>Projects</h2>
              {resumeData.projects.map((proj, idx) => {
                const desc = processDescription(proj.description);
                
                return (
                  <div key={idx} className="project-entry">
                    <h3>{proj.name}</h3>
                    <div className="position-duration">
                      {proj.position && <span className="position">{proj.position}</span>}
                      <span className="duration">{proj.duration}</span>
                    </div>
                    {Array.isArray(desc) ? (
                      <ul>
                        {desc.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    ) : (
                      <p>{desc}</p>
                    )}
                  </div>
                );
              })}
            </section>
          )}

          {resumeData.researchs && resumeData.researchs.length > 0 && (
            <section>
              <h2>Research</h2>
              {resumeData.researchs.map((res, idx) => {
                const desc = processDescription(res.description);
                
                return (
                  <div key={idx} className="project-entry">
                    <h3>{res.name}</h3>
                    <div className="position-duration">
                      <span className="duration">{res.duration}</span>
                    </div>
                    {Array.isArray(desc) ? (
                      <ul>
                        {desc.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    ) : (
                      <p>{desc}</p>
                    )}
                  </div>
                );
              })}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview; 