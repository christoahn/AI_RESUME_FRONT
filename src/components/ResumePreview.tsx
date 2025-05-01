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
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  handleDownloadPDF,
  handleDownloadDOCX,
}) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume Print</title>
          <style>
            @media print {
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 20mm;
                color: #000;
              }
              h1 {
                font-size: 24pt;
                margin-bottom: 10pt;
                color: #000;
              }
              h2 {
                font-size: 18pt;
                margin-top: 20pt;
                margin-bottom: 10pt;
                color: #000;
                border-bottom: 1px solid #000;
              }
              h3 {
                font-size: 14pt;
                margin-top: 15pt;
                margin-bottom: 5pt;
                color: #000;
              }
              p {
                font-size: 11pt;
                margin: 5pt 0;
              }
              ul {
                margin: 5pt 0;
                padding-left: 20pt;
              }
              li {
                font-size: 11pt;
                margin: 3pt 0;
              }
              .resume-section {
                margin-bottom: 15pt;
              }
              .basic-info {
                margin-bottom: 20pt;
              }
              .basic-info p {
                font-size: 11pt;
                margin: 3pt 0;
              }
              .basic-info span {
                margin-right: 15pt;
              }
              @page {
                size: A4;
                margin: 20mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="basic-info">
            <h1>${resumeData.name}</h1>
            <p>
              ${resumeData.email ? `<span>Email: ${resumeData.email}</span>` : ''}
              ${resumeData.phone ? `<span>Phone: ${resumeData.phone}</span>` : ''}
              ${resumeData.address ? `<span>Address: ${resumeData.address}</span>` : ''}
            </p>
          </div>

          ${resumeData.projects && resumeData.projects.length > 0 ? `
            <h2>Projects</h2>
            ${resumeData.projects.map(proj => `
              <div class="resume-section">
                <h3>${proj.name}</h3>
                ${proj.position ? `<p>Position: ${proj.position}</p>` : ''}
                <p>Duration: ${proj.duration}</p>
                ${proj.description ? `
                  ${Array.isArray(proj.description) ? `
                    <ul>
                      ${proj.description.map(desc => `<li>${desc}</li>`).join('')}
                    </ul>
                  ` : `<p>${proj.description}</p>`}
                ` : ''}
              </div>
            `).join('')}
          ` : ''}

          ${resumeData.jobs && resumeData.jobs.length > 0 ? `
            <h2>Work Experience</h2>
            ${resumeData.jobs.map(job => `
              <div class="resume-section">
                <h3>${job.name} - ${job.position}</h3>
                <p>Duration: ${job.duration}</p>
                ${job.description ? `
                  ${Array.isArray(job.description) ? `
                    <ul>
                      ${job.description.map(desc => `<li>${desc}</li>`).join('')}
                    </ul>
                  ` : `<p>${job.description}</p>`}
                ` : ''}
              </div>
            `).join('')}
          ` : ''}

          ${resumeData.researchs && resumeData.researchs.length > 0 ? `
            <h2>Research</h2>
            ${resumeData.researchs.map(res => `
              <div class="resume-section">
                <h3>${res.name}</h3>
                <p>Duration: ${res.duration}</p>
                ${res.description ? `
                  ${Array.isArray(res.description) ? `
                    <ul>
                      ${res.description.map(desc => `<li>${desc}</li>`).join('')}
                    </ul>
                  ` : `<p>${res.description}</p>`}
                ` : ''}
              </div>
            `).join('')}
          ` : ''}

          ${resumeData.educations && resumeData.educations.length > 0 ? `
            <h2>Education</h2>
            ${resumeData.educations.map(edu => `
              <div class="resume-section">
                <h3>${edu.name}</h3>
                <p>${edu.degree} (${edu.duration})</p>
                <p>Major: ${edu.major}</p>
                ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
                ${edu.description ? `
                  ${Array.isArray(edu.description) ? `
                    <ul>
                      ${edu.description.map(desc => `<li>${desc}</li>`).join('')}
                    </ul>
                  ` : `<p>${edu.description}</p>`}
                ` : ''}
              </div>
            `).join('')}
          ` : ''}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // 이미지와 폰트가 로드될 때까지 기다린 후 프린트
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // 프린트 후 창 닫기
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 500);
    };
  };

  const handleCopyLink = () => {
    alert('Link copied to clipboard!');
  };

  const renderDescription = (description: string | string[] | undefined) => {
    if (!description) return null;
    
    let descArray: string[];
    if (typeof description === 'string') {
      if (description.trim().startsWith('[')) {
        try {
          descArray = safeParseJSON(description);
        } catch {
          descArray = [description];
        }
      } else {
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
          <p>
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
  );
};

export default ResumePreview; 