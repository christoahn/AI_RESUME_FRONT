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
              {resumeData.projects.map((proj, idx) => {
                let desc = proj.description;
                if (typeof desc === 'string' && desc.trim().startsWith('[')) {
                  try {
                    desc = JSON.parse(desc);
                  } catch (e) {}
                }
                return (
                  <div key={idx} className="resume-section">
                    <h3>{proj.name}</h3>
                    {proj.position && <p>Position: {proj.position}</p>}
                    <p>Duration: {proj.duration}</p>
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
                let desc = job.description;
                if (typeof desc === 'string' && desc.trim().startsWith('[')) {
                  try {
                    desc = JSON.parse(desc);
                  } catch (e) {}
                }
                return (
                  <div key={idx} className="resume-section">
                    <h3>{job.name} - {job.position}</h3>
                    <p>Duration: {job.duration}</p>
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
                let desc = res.description;
                if (typeof desc === 'string' && desc.trim().startsWith('[')) {
                  try {
                    desc = JSON.parse(desc);
                  } catch (e) {}
                }
                return (
                  <div key={idx} className="resume-section">
                    <h3>{res.name}</h3>
                    <p>Duration: {res.duration}</p>
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

          {resumeData.educations && resumeData.educations.length > 0 && (
            <section>
              <h2>Education</h2>
              {resumeData.educations.map((edu, idx) => {
                let desc = edu.description;
                if (typeof desc === 'string' && desc.trim().startsWith('[')) {
                  try {
                    desc = JSON.parse(desc);
                  } catch (e) {}
                }
                return (
                  <div key={idx} className="resume-section">
                    <h3>{edu.name}</h3>
                    <p>{edu.degree} ({edu.duration})</p>
                    <p>Major: {edu.major}</p>
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
        </div>
      </div>
    </div>
  );
};

export default ResumePreview; 