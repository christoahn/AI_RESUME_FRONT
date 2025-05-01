import React from 'react';
import '../assets/ResumePreview.css';
import { ResumeData } from '../types';
import { safeParseJSON } from '../utils/api';

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

interface ResumePreviewProps {
  resumeData: ResumeData;
  handleDownloadPDF: () => void;
  handleDownloadDOCX: () => void;
  handlePrint: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  handleDownloadPDF,
  handleDownloadDOCX,
  handlePrint,
}) => {
  const renderDescription = (description: string | string[] | undefined) => {
    if (!description) return null;
    
    let descArray: string[];
    if (typeof description === 'string') {
      try {
        descArray = safeParseJSON(description);
      } catch {
        descArray = [description];
      }
    } else {
      descArray = description;
    }
    
    return (
      <ul>
        {descArray.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  const handleCopyLink = () => {
    alert('Link copied to clipboard!');
  };

  return (
    <div className="resume-preview-container">
      <div className="preview-header">
        <h2>Resume Preview</h2>
        <div className="resume-actions">
          <button onClick={handlePrint} className="action-button print-btn">
            <i className="fas fa-print"></i> Print
          </button>
          <button onClick={handleDownloadPDF} className="action-button pdf-btn">
            <i className="fas fa-file-pdf"></i> PDF
          </button>
          <button onClick={handleDownloadDOCX} className="action-button docx-btn">
            <i className="fas fa-file-word"></i> DOCX
          </button>
          <button onClick={handleCopyLink} className="action-button link-btn">
            <i className="fas fa-link"></i> Link
          </button>
        </div>
      </div>
      
      <div className="preview-content">
        <div className="resume-preview" id="resume-preview">
          <div className="resume-document">
            <h1>{resumeData.name}</h1>
            <p className="contact-info">
              {resumeData.email && <span>Email: {resumeData.email}</span>}
              {resumeData.phone && <span>Phone: {resumeData.phone}</span>}
              {resumeData.address && <span>Address: {resumeData.address}</span>}
            </p>

            {resumeData.projects && resumeData.projects.length > 0 && (
              <section>
                <h2>Projects</h2>
                {resumeData.projects.map((proj, idx) => (
                  <div key={idx} className="resume-section">
                    <h3>{proj.name}</h3>
                    {proj.position && <p>Position: {proj.position}</p>}
                    <p>Duration: {proj.duration}</p>
                    {renderDescription(proj.description)}
                  </div>
                ))}
              </section>
            )}

            {resumeData.jobs && resumeData.jobs.length > 0 && (
              <section>
                <h2>Work Experience</h2>
                {resumeData.jobs.map((job, idx) => (
                  <div key={idx} className="resume-section">
                    <h3>{job.name} - {job.position}</h3>
                    <p>Duration: {job.duration}</p>
                    {renderDescription(job.description)}
                  </div>
                ))}
              </section>
            )}

            {resumeData.researchs && resumeData.researchs.length > 0 && (
              <section>
                <h2>Research</h2>
                {resumeData.researchs.map((res, idx) => (
                  <div key={idx} className="resume-section">
                    <h3>{res.name}</h3>
                    <p>Duration: {res.duration}</p>
                    {renderDescription(res.description)}
                  </div>
                ))}
              </section>
            )}

            {resumeData.educations && resumeData.educations.length > 0 && (
              <section>
                <h2>Education</h2>
                {resumeData.educations.map((edu, idx) => (
                  <div key={idx} className="resume-section">
                    <h3>{edu.name}</h3>
                    <p>{edu.degree} ({edu.duration})</p>
                    <p>Major: {edu.major}</p>
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    {renderDescription(edu.description)}
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview; 