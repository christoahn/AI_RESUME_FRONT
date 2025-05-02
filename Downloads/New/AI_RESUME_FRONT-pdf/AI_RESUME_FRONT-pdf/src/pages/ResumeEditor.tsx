import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import '../assets/ResumeEditor.css';
import resumeApi from '../api/resumeApi';
import ResumePreview from '../components/ResumePreview';

interface ChatMessage {
  content: string;
  isUser: boolean;
}

const ResumeEditor: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { content: "Hello! I'm your resume assistant. I can help you optimize your resume. What would you like to improve?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const userInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('resume_id');

  useEffect(() => {
    console.log("This is resume editor")
    if (!resumeId) {
      navigate('/');
      return;
    }
    const fetchResume = async () => {
      try {
        const data = await resumeApi.getResume(Number(resumeId));
        if (data) {
          setResumeData(data);
        } else {
          navigate('/');
        }
      } catch (err) {
        navigate('/');
      }
    };
    fetchResume();
  }, [resumeId, navigate]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    console.log('resumeData:', resumeData);
  }, [resumeData]);

  const addMessage = (content: string, isUser: boolean) => {
    setMessages((prevMessages: ChatMessage[]) => [...prevMessages, { content, isUser }]);
  };

  const resumeDataToHTML = (data: any) => {
    if (!data) return '';
    let html = `<h1>${data.name || ''}</h1>`;
    html += `<p>Email: ${data.email || ''} | Phone: ${data.phone || ''} | Address: ${data.address || ''}</p>`;
    
    if (data.projects && data.projects.length > 0) {
      html += '<h2>Projects</h2>';
      data.projects.forEach((proj: any) => {
        html += `<div><h3>${proj.name}</h3><p>Duration: ${proj.duration}</p><p>${proj.description}</p></div>`;
      });
    }
    
    if (data.jobs && data.jobs.length > 0) {
      html += '<h2>Work Experience</h2>';
      data.jobs.forEach((job: any) => {
        html += `<div><h3>${job.name} - ${job.position}</h3><p>Duration: ${job.duration}</p><p>${job.description}</p></div>`;
      });
    }
    
    if (data.researchs && data.researchs.length > 0) {
      html += '<h2>Research</h2>';
      data.researchs.forEach((res: any) => {
        html += `<div><h3>${res.name}</h3><p>Duration: ${res.duration}</p><p>${res.description}</p></div>`;
      });
    }
    
    if (data.educations && data.educations.length > 0) {
      html += '<h2>Education</h2>';
      data.educations.forEach((edu: any) => {
        html += `<div><h3>${edu.name}</h3><p>${edu.degree} (${edu.duration})</p><p>Major: ${edu.major}</p>${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}</div>`;
      });
    }
    
    return html;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    addMessage(inputValue, true);
    setInputValue('');
    setIsTyping(true);
    try {
      const response = await resumeApi.chatWithAI(inputValue, resumeData);
      setIsTyping(false);
      if (response.status === 'success') {
        addMessage(response.response, false);
        if (response.updated_json) {
          setResumeData(response.updated_json);
          if (resumeId) {
            await resumeApi.updateResume(Number(resumeId), response.updated_json);
          }
        }
      } else {
        addMessage("Sorry, I encountered an error processing your request.", false);
      }
    } catch (error) {
      console.error('Chat API error:', error);
      setIsTyping(false);
      addMessage("Sorry, there was a problem connecting to the server.", false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    userInputRef.current?.focus();
  };

  const handleDownloadPDF = () => {
    const element = document.createElement('div');
    element.innerHTML = resumeDataToHTML(resumeData);
    
    const opt = {
      margin: 10,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const handleDownloadDOCX = async () => {
    try {
      const html = resumeDataToHTML(resumeData);
      const blob = await resumeApi.generateDocx(html);
      
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.docx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading DOCX:', error);
      alert('Error downloading DOCX file. Please try again.');
    }
  };

  const handlePrint = () => {
    if (!resumeData || !resumeData.data) {
      alert('이력서 데이터를 찾을 수 없습니다.');
      return;
    }

    // 인쇄용 스타일을 적용한 새 창 열기
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
      return;
    }
    
    const data = resumeData.data;
    
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
            <h1>${data.name || ''}</h1>
            <div class="contact-info">Email: ${data.email || ''} | Phone: ${data.phone || ''} | Address: ${data.address || ''}</div>
            
            ${data.projects && Object.values(data.projects).length > 0 ? `
              <div class="section">
                <h2>Projects</h2>
                ${Object.values(data.projects).map((project: any) => {
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
            
            ${data.jobs && Object.values(data.jobs).length > 0 ? `
              <div class="section">
                <h2>Work Experience</h2>
                ${Object.values(data.jobs).map((job: any) => {
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
            
            ${data.researches && Object.values(data.researches).length > 0 ? `
              <div class="section">
                <h2>Research</h2>
                ${Object.values(data.researches).map((research: any) => {
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
            
            ${data.educations && Object.values(data.educations).length > 0 ? `
              <div class="section">
                <h2>Education</h2>
                ${Object.values(data.educations).map((education: any) => {
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

  return (
    <div className="resume-editor-container">
      <div className="chat-section">
        <div className="chat-container">
          <div className="chat-header">
            <h2>AI Resume Assistant</h2>
            <p>Chat with our AI to improve your resume</p>
          </div>

          <div className="chat-messages" ref={chatMessagesRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                <p>{msg.content}</p>
              </div>
            ))}
            
            {isTyping && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>
          
          <div className="chat-input">
            <input
              type="text"
              ref={userInputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message here..."
            />
            <button onClick={handleSendMessage}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>

          <div className="prompt-suggestions">
            <h3>Suggestions:</h3>
            <div className="prompt-buttons">
              <button 
                className="prompt-btn" 
                onClick={() => handlePromptClick("Improve my project description")}
              >
                Improve description
              </button>
              <button 
                className="prompt-btn" 
                onClick={() => handlePromptClick("Add more technical details")}
              >
                Add technical details
              </button>
              <button 
                className="prompt-btn" 
                onClick={() => handlePromptClick("Make my position more impactful")}
              >
                Enhance impact
              </button>
              <button 
                className="prompt-btn" 
                onClick={() => handlePromptClick("Suggest additional skills")}
              >
                Suggest skills
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="preview-section">
        {resumeData && resumeData.data && (
          <ResumePreview 
            resumeData={{
              ...resumeData.data,
              projects: Object.values(resumeData.data.projects || {}),
              jobs: Object.values(resumeData.data.jobs || {}),
              educations: Object.values(resumeData.data.educations || {}),
              researchs: Object.values(resumeData.data.researches || {}),
            }}
            handleDownloadPDF={handleDownloadPDF}
            handleDownloadDOCX={handleDownloadDOCX}
            handlePrint={handlePrint}
          />
        )}
      </div>
    </div>
  );
};

export default ResumeEditor; 