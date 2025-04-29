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
        html += `<div><h3>${proj.title}</h3><p>Duration: ${proj.project_duration}</p></div>`;
      });
    }
    if (data.jobs && data.jobs.length > 0) {
      html += '<h2>Work Experience</h2>';
      data.jobs.forEach((job: any) => {
        html += `<div><h3>${job.company_name} - ${job.position}</h3><p>Duration: ${job.work_duration}</p></div>`;
      });
    }
    if (data.researchs && data.researchs.length > 0) {
      html += '<h2>Research</h2>';
      data.researchs.forEach((res: any) => {
        html += `<div><h3>${res.title}</h3><p>Duration: ${res.research_duration}</p></div>`;
      });
    }
    if (data.educations && data.educations.length > 0) {
      html += '<h2>Education</h2>';
      data.educations.forEach((edu: any) => {
        html += `<div><h3>${edu.school_name}</h3><p>${edu.degree} (${edu.graduation_year})</p></div>`;
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
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Resume</title>
            <style>
              body { 
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 20mm;
              }
            </style>
          </head>
          <body>
            ${resumeDataToHTML(resumeData)}
            <script>
              window.onload = function() {
                window.print();
                window.setTimeout(function() { window.close(); }, 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
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
        {resumeData && (
          <ResumePreview 
            resumeData={resumeData}
            handleDownloadPDF={handleDownloadPDF}
            handleDownloadDOCX={handleDownloadDOCX}
          />
        )}
      </div>
    </div>
  );
};

export default ResumeEditor; 