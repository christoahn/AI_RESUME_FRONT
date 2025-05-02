import React from 'react';
import '../assets/ResumePreview.css';

// Add inline styles for note messages since the CSS file might be deleted
const styles = {
  noteMessage: {
    fontStyle: 'italic',
    color: '#666',
    backgroundColor: '#f8f8f8',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '0.9em'
  }
};

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
  coursework?: string;
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
    // Handle special error messages
    if (desc === '[]' || desc === '[' || desc === ']' || 
        desc === 'Failed to parse generated content. Please try again.' ||
        desc === 'Your content will appear here once generated. Please try again with your request.') {
      return '';
    }
    
    // Handle other error-like messages but still show them
    if (desc.includes('Failed to parse generated content') ||
        desc.includes('Your content will appear here') ||
        desc.includes('Please provide more specific details')) {
      // Clean up the message for display
      return desc;
    }
    
    if (desc.trim().startsWith('[')) {
      try {
        // First attempt: standard JSON parse
        const parsed = JSON.parse(desc);
        // Check if it's an empty array or contains only empty strings
        if (Array.isArray(parsed) && (parsed.length === 0 || parsed.every(item => item === ''))) {
          return '';
        }
        return parsed;
      } catch (e1) {
        try {
          // Second attempt: replace single quotes with double quotes
          const parsed = JSON.parse(desc.replace(/'/g, '"'));
          // Check if it's an empty array or contains only empty strings
          if (Array.isArray(parsed) && (parsed.length === 0 || parsed.every(item => item === ''))) {
            return '';
          }
          return parsed;
        } catch (e2) {
          try {
            // Third attempt: remove brackets and parse as comma-separated items
            const cleaned = desc.replace(/^\[|\]$/g, '').trim();
            
            // Handle multiple delimiter patterns
            const items = cleaned.split(/,\s*(?=["']|[^,"']+$)/);
            
            // Clean up each item
            const result = items.map(item => 
              item.trim()
                .replace(/^["']|["']$/g, '') // Remove quotes at start/end
                .replace(/\\"/g, '"') // Convert escaped quotes
                .trim()
            ).filter(item => item !== ''); // Remove empty items
            
            // If all items were empty, return empty string
            if (result.length === 0) {
              return '';
            }
            
            return result;
          } catch (e3) {
            // Last resort: just remove brackets and return as single string
            const result = desc.replace(/^\[|\]$/g, '').trim();
            return result === '' ? '' : result;
          }
        }
      }
    }
  } else if (Array.isArray(desc)) {
    // If it's already an array, filter out empty strings
    const filtered = desc.filter(item => item && item.trim() !== '');
    if (filtered.length === 0) {
      return '';
    }
    return filtered;
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
                    {edu.coursework && edu.coursework.trim() !== "" && <p className="coursework">Coursework: {edu.coursework}</p>}
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
                    {desc && Array.isArray(desc) && desc.length > 0 ? (
                      <ul>
                        {desc.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    ) : (
                      desc && typeof desc === 'string' && desc.trim() !== '' ? (
                        desc.includes('Please') || desc.includes('content will appear') ? 
                          <p style={styles.noteMessage}>{desc}</p> :
                          <p>{desc}</p>
                      ) : null
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
                    {desc && Array.isArray(desc) && desc.length > 0 ? (
                      <ul>
                        {desc.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    ) : (
                      desc && typeof desc === 'string' && desc.trim() !== '' ? (
                        desc.includes('Please') || desc.includes('content will appear') ? 
                          <p style={styles.noteMessage}>{desc}</p> :
                          <p>{desc}</p>
                      ) : null
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
                    {desc && Array.isArray(desc) && desc.length > 0 ? (
                      <ul>
                        {desc.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    ) : (
                      desc && typeof desc === 'string' && desc.trim() !== '' ? (
                        desc.includes('Please') || desc.includes('content will appear') ? 
                          <p style={styles.noteMessage}>{desc}</p> :
                          <p>{desc}</p>
                      ) : null
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