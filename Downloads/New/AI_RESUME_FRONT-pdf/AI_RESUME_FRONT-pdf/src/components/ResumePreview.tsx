import React from 'react';
import '../assets/ResumePreview.css';
import { useSearchParams } from 'react-router-dom';

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
  id?: string;
}

interface ResumePreviewProps {
  resumeData: ResumeData;
  handleDownloadPDF: () => void;
  handleDownloadDOCX: () => void;
  handlePrint?: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  handleDownloadPDF,
  handleDownloadDOCX,
  handlePrint: externalHandlePrint,
}) => {
  const searchParams = useSearchParams()[0];

  const handlePrint = () => {
    // 외부에서 전달된 handlePrint 함수가 있으면 그것을 사용
    if (externalHandlePrint) {
      externalHandlePrint();
      return;
    }
    
    // 기존 로직
    // 인쇄용 스타일을 적용한 새 창 열기
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
      return;
    }
    
    // 이력서 콘텐츠 생성 - 최대한 간결하게 필요한 내용만 포함
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>이력서 인쇄</title>
          <style>
            @page {
              size: A4;
              margin: 2cm;
            }
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.5;
              color: #333;
              background-color: white;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 21cm;
              margin: 0 auto;
              padding: 0;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 10px;
              color: #000;
              text-align: center;
            }
            h2 {
              font-size: 18px;
              margin: 15px 0 10px 0;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
              color: #333;
            }
            h3 {
              font-size: 16px;
              margin: 12px 0 5px 0;
              color: #444;
            }
            p {
              margin: 5px 0;
              font-size: 14px;
            }
            ul {
              padding-left: 20px;
              margin: 5px 0 10px 0;
            }
            li {
              margin-bottom: 3px;
              font-size: 14px;
            }
            .contact-info {
              text-align: center;
              margin-bottom: 20px;
              font-size: 14px;
            }
            .section {
              margin-bottom: 15px;
            }
            @media print {
              body {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
              }
              .no-print {
                display: none !important;
              }
            }
            .no-print {
              margin-top: 20px;
              text-align: center;
            }
            .btn {
              padding: 8px 16px;
              margin: 0 5px;
              background-color: #666;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            }
            .btn:hover {
              background-color: #555;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${resumeData.name || ''}</h1>
            <div class="contact-info">Email: ${resumeData.email || ''} | Phone: ${resumeData.phone || ''} | Address: ${resumeData.address || ''}</div>
            
            ${resumeData.projects && resumeData.projects.length > 0 ? `
              <div class="section">
                <h2>Projects</h2>
                ${resumeData.projects.map((project: any) => {
                  let desc = typeof project.description === 'string' ? project.description : '';
                  try {
                    if (typeof desc === 'string' && desc.trim().startsWith('[')) {
                      desc = JSON.parse(desc.replace(/'/g, '"'));
                    }
                  } catch (e) {}
                  
                  return `
                    <div>
                      <h3>${project.name || ''}</h3>
                      ${project.position ? `<p>Position: ${project.position}</p>` : ''}
                      <p>Duration: ${project.duration || ''}</p>
                      ${Array.isArray(desc) 
                        ? `<ul>${desc.map((d: string) => `<li>${d}</li>`).join('')}</ul>`
                        : `<p>${desc}</p>`
                      }
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}
            
            ${resumeData.jobs && resumeData.jobs.length > 0 ? `
              <div class="section">
                <h2>Work Experience</h2>
                ${resumeData.jobs.map((job: any) => {
                  let desc = typeof job.description === 'string' ? job.description : '';
                  try {
                    if (typeof desc === 'string' && desc.trim().startsWith('[')) {
                      desc = JSON.parse(desc.replace(/'/g, '"'));
                    }
                  } catch (e) {}
                  
                  return `
                    <div>
                      <h3>${job.name || ''} ${job.position ? `- ${job.position}` : ''}</h3>
                      <p>Duration: ${job.duration || ''}</p>
                      ${Array.isArray(desc) 
                        ? `<ul>${desc.map((d: string) => `<li>${d}</li>`).join('')}</ul>`
                        : `<p>${desc}</p>`
                      }
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}
            
            ${resumeData.researchs && resumeData.researchs.length > 0 ? `
              <div class="section">
                <h2>Research</h2>
                ${resumeData.researchs.map((research: any) => {
                  let desc = typeof research.description === 'string' ? research.description : '';
                  try {
                    if (typeof desc === 'string' && desc.trim().startsWith('[')) {
                      desc = JSON.parse(desc.replace(/'/g, '"'));
                    }
                  } catch (e) {}
                  
                  return `
                    <div>
                      <h3>${research.name || ''}</h3>
                      <p>Duration: ${research.duration || ''}</p>
                      ${Array.isArray(desc) 
                        ? `<ul>${desc.map((d: string) => `<li>${d}</li>`).join('')}</ul>`
                        : `<p>${desc}</p>`
                      }
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}
            
            ${resumeData.educations && resumeData.educations.length > 0 ? `
              <div class="section">
                <h2>Education</h2>
                ${resumeData.educations.map((education: any) => {
                  let desc = typeof education.description === 'string' ? education.description : '';
                  try {
                    if (typeof desc === 'string' && desc.trim().startsWith('[')) {
                      desc = JSON.parse(desc.replace(/'/g, '"'));
                    }
                  } catch (e) {}
                  
                  return `
                    <div>
                      <h3>${education.name || ''}</h3>
                      <p>${education.degree || ''} ${education.duration ? `(${education.duration})` : ''}</p>
                      <p>Major: ${education.major || ''}</p>
                      ${education.gpa ? `<p>GPA: ${education.gpa}</p>` : ''}
                      ${Array.isArray(desc) 
                        ? `<ul>${desc.map((d: string) => `<li>${d}</li>`).join('')}</ul>`
                        : `<p>${desc}</p>`
                      }
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}
          </div>
          
          <div class="no-print">
            <button class="btn" onclick="window.print()">인쇄하기</button>
            <button class="btn" onclick="window.close()">닫기</button>
          </div>
          
          <script>
            // 자동으로 인쇄 대화상자 표시
            setTimeout(function() {
              window.print();
            }, 500);
          </script>
        </body>
      </html>
    `;
    
    // 인쇄 창에 내용 쓰기
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
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
                let desc = proj.description || '';
                if (typeof desc === 'string' && desc.trim().startsWith('[')) {
                  try {
                    desc = JSON.parse(desc);
                  } catch (e) {
                    try { 
                      if (typeof desc === 'string') {
                        desc = JSON.parse(desc.replace(/'/g, '"')); 
                      }
                    } catch (e) { }
                  }
                }
                console.log('최종 desc(projects):', desc, Array.isArray(desc));
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
                let desc = job.description || '';
                if (typeof desc === 'string' && desc.trim().startsWith('[')) {
                  try {
                    desc = JSON.parse(desc);
                  } catch (e) {
                    try { 
                      if (typeof desc === 'string') {
                        desc = JSON.parse(desc.replace(/'/g, '"')); 
                      }
                    } catch (e) { }
                  }
                }
                console.log('최종 desc(jobs):', desc, Array.isArray(desc));
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
                let desc = res.description || '';
                if (typeof desc === 'string' && desc.trim().startsWith('[')) {
                  try {
                    desc = JSON.parse(desc);
                  } catch (e) {
                    try { 
                      if (typeof desc === 'string') {
                        desc = JSON.parse(desc.replace(/'/g, '"')); 
                      }
                    } catch (e) { }
                  }
                }
                console.log('최종 desc(researchs):', desc, Array.isArray(desc));
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
                let desc = edu.description || '';
                if (typeof desc === 'string' && desc.trim().startsWith('[')) {
                  try {
                    desc = JSON.parse(desc);
                  } catch (e) {
                    try { 
                      if (typeof desc === 'string') {
                        desc = JSON.parse(desc.replace(/'/g, '"')); 
                      }
                    } catch (e) { }
                  }
                }
                console.log('최종 desc(educations):', desc, Array.isArray(desc));
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