import React from 'react';
import '../assets/ResumePreview.css';

interface Project {
  title: string;
  project_duration: string;
}
interface Job {
  company_name: string;
  position: string;
  work_duration: string;
}
interface Research {
  title: string;
  research_duration: string;
}
interface Education {
  school_name: string;
  degree: string;
  graduation_year: string;
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

const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  handleDownloadPDF,
  handleDownloadDOCX,
}) => {
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
          <p>Email: {resumeData.email} | Phone: {resumeData.phone} | Address: {resumeData.address}</p>

          {resumeData.projects && resumeData.projects.length > 0 && (
            <section>
              <h2>Projects</h2>
              {resumeData.projects.map((proj, idx) => (
                <div key={idx} className="resume-section">
                  <h3>{proj.title}</h3>
                  <p>Duration: {proj.project_duration}</p>
                </div>
              ))}
            </section>
          )}

          {resumeData.jobs && resumeData.jobs.length > 0 && (
            <section>
              <h2>Work Experience</h2>
              {resumeData.jobs.map((job, idx) => (
                <div key={idx} className="resume-section">
                  <h3>{job.company_name} - {job.position}</h3>
                  <p>Duration: {job.work_duration}</p>
                </div>
              ))}
            </section>
          )}

          {resumeData.researchs && resumeData.researchs.length > 0 && (
            <section>
              <h2>Research</h2>
              {resumeData.researchs.map((res, idx) => (
                <div key={idx} className="resume-section">
                  <h3>{res.title}</h3>
                  <p>Duration: {res.research_duration}</p>
                </div>
              ))}
            </section>
          )}

          {resumeData.educations && resumeData.educations.length > 0 && (
            <section>
              <h2>Education</h2>
              {resumeData.educations.map((edu, idx) => (
                <div key={idx} className="resume-section">
                  <h3>{edu.school_name}</h3>
                  <p>{edu.degree} ({edu.graduation_year})</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview; 