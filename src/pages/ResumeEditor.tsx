import React, { useState, useEffect, useRef, ReactElement } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import '../assets/ResumeEditor.css';
import resumeApi from '../api/resumeApi';
import ResumePreview from '../components/ResumePreview';
//청크
import ChunkEditor from '../components/ChunkEditor';

interface ChatMessage {
  content: string;
  isUser: boolean;
}
//청크
type EditorTab = 'chat' | 'chunk-editor' | 'preview';

const ResumeEditor = (): ReactElement => {
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
  const [activeTab, setActiveTab] = useState<EditorTab>('chat');

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
      console.log(typeof data.projects)
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
        html += `<div><h3>${edu.name}</h3><p>${edu.degree} (${edu.duration})</p><p>Major: ${edu.major}</p>${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}${edu.coursework && edu.coursework.trim() !== '' ? `<p class="coursework">Coursework: ${edu.coursework}</p>` : ''}</div>`;
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
    if (!resumeData || !resumeData.data) {
      alert('No resume data available to download');
      return;
    }

    
    const resumeElement = document.querySelector('.resume-document');
    if (!resumeElement) {
      alert('Resume element not found on page');
      return;
    }

    
    const element = document.createElement('div');
    element.innerHTML = resumeElement.outerHTML;
    
    
    const style = document.createElement('style');
    style.textContent = `
      body {
        margin: 0;
        padding: 0;
      }
      .resume-document {
        padding: 40px 50px;
        font-family: 'Georgia', 'Garamond', serif;
        line-height: 1.5;
        color: #333;
        letter-spacing: 0.2px;
        font-size: 11pt;
        background-color: white;
      }
      h1 {
        font-size: 22pt;
        margin-bottom: 8px;
        color: #1a1a1a;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-family: 'Arial', 'Helvetica', sans-serif;
        font-weight: 600;
      }
      h2 {
        font-size: 14pt;
        margin: 20px 0 10px 0;
        border-bottom: 2px solid #2c3e50;
        padding-bottom: 5px;
        color: #2c3e50;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        font-weight: bold;
        font-family: 'Arial', 'Helvetica', sans-serif;
      }
      h3 {
        font-size: 12pt;
        margin-bottom: 5px;
        color: #333;
        font-weight: bold;
        font-family: 'Arial', 'Helvetica', sans-serif;
      }
      p {
        margin-bottom: 8px;
        font-size: 11pt;
      }
      .contact-info {
        text-align: center;
        margin-bottom: 20px;
        font-size: 11pt;
        color: #555;
      }
      .education-entry, .work-entry, .project-entry {
        margin-bottom: 15px;
      }
      .position-duration {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }
      .position {
        font-style: italic;
        color: #555;
      }
      .duration {
        color: #777;
      }
      .coursework {
        font-style: italic;
        color: #444;
        margin-top: 4px;
      }
      ul {
        padding-left: 20px;
        margin-bottom: 10px;
      }
      li {
        margin-bottom: 5px;
      }
    `;
    
    // Set up PDF options
    const opt = {
      margin: 10,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Create a temporary container and append to document body
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.appendChild(style);
    container.appendChild(element);
    document.body.appendChild(container);
    
    // Generate PDF and then clean up
    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .then(() => {
        document.body.removeChild(container);
      });
  };

  const handleDownloadDOCX = () => {
    if (!resumeData || !resumeData.data) {
      alert('No resume data available to download');
      return;
    }
    
    // Clone the resume document element
    const element = document.querySelector('.resume-document')?.cloneNode(true) as HTMLElement;
    if (!element) {
      alert('Unable to find resume content');
      return;
    }
    
    // Create style element
    const style = document.createElement('style');
    style.innerHTML = `
      body {
        font-family: 'Arial', 'Helvetica', sans-serif;
        line-height: 1.5;
        color: #333;
        letter-spacing: 0.2px;
        font-size: 11pt;
        background-color: white;
      }
      h1 {
        font-size: 22pt;
        margin-bottom: 8px;
        color: #1a1a1a;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-family: 'Arial', 'Helvetica', sans-serif;
        font-weight: 600;
      }
      h2 {
        font-size: 14pt;
        margin: 20px 0 10px 0;
        border-bottom: 2px solid #2c3e50;
        padding-bottom: 5px;
        color: #2c3e50;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        font-weight: bold;
        font-family: 'Arial', 'Helvetica', sans-serif;
      }
      h3 {
        font-size: 12pt;
        margin-bottom: 5px;
        color: #333;
        font-weight: bold;
        font-family: 'Arial', 'Helvetica', sans-serif;
      }
      p {
        margin-bottom: 8px;
        font-size: 11pt;
      }
      .contact-info {
        text-align: center;
        margin-bottom: 20px;
        font-size: 11pt;
        color: #555;
      }
      .education-entry, .work-entry, .project-entry {
        margin-bottom: 15px;
      }
      .position-duration {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }
      .position {
        font-style: italic;
        color: #555;
      }
      .duration {
        color: #777;
      }
      .coursework {
        font-style: italic;
        color: #444;
        margin-top: 4px;
      }
      ul {
        padding-left: 20px;
        margin-bottom: 10px;
      }
      li {
        margin-bottom: 5px;
      }
    `;
    
    // Create a temporary container and append to document body
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.appendChild(style);
    container.appendChild(element);
    document.body.appendChild(container);
    
    // Convert to HTML string
    const htmlContent = container.innerHTML;
    
    // Send to server for DOCX conversion
    const generateDocx = async () => {
      try {
        // Set loading state or spinner here if needed
        
        // Call API to generate DOCX
        const blob = await resumeApi.generateDocx(htmlContent);
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.data.name || 'resume'}.docx`;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        document.body.removeChild(container);
      } catch (error) {
        console.error('Error generating DOCX:', error);
        alert('Failed to generate DOCX. Please try again.');
        document.body.removeChild(container);
      }
    };
    
    generateDocx();
  };

  const handleChunkUpdated = (chunkType: string, chunkId: number, updatedContent: string) => {
    if (resumeId) {
      resumeApi.getResume(Number(resumeId))
        .then(data => {
          setResumeData(data);
        })
        .catch(err => {
          console.error('Failed to refresh resume data:', err);
        });
    }
  };

  const handleTabChange = (tab: EditorTab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="chat-container">
            <div className="chat-messages" ref={chatMessagesRef}>
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}>
                  {message.content}
                </div>
              ))}
              {isTyping && (
                <div className="message ai-message">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>
            <div className="user-input-container">
              <input
                type="text"
                ref={userInputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me how to improve your resume..."
                disabled={isTyping}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isTyping || !inputValue.trim()}
              >
                Send
              </button>
            </div>
            <div className="quick-prompts">
              <p>Try asking:</p>
              <div className="prompt-buttons">
                <button onClick={() => handlePromptClick("Please make my resume more professional.")}>Make it more professional</button>
                <button onClick={() => handlePromptClick("Fix any grammar issues in my resume.")}>Fix grammar</button>
                <button onClick={() => handlePromptClick("Improve my project descriptions.")}>Improve project descriptions</button>
                <button onClick={() => handlePromptClick("Help me highlight my achievements better.")}>Highlight achievements</button>
              </div>
            </div>
          </div>
        );
      
      case 'chunk-editor':
        return resumeId ? (
          <ChunkEditor
            resumeId={Number(resumeId)}
            onChunkUpdated={handleChunkUpdated}
          />
        ) : (
          <div className="error-message">Resume ID is missing. Please try again.</div>
        );
      
      case 'preview':
        return (
          <div className="preview-container">
            <div className="preview-actions">
              <button onClick={handleDownloadPDF} className="download-btn">Export PDF</button>
              <button onClick={handleDownloadDOCX} className="download-btn">Export DOCX</button>
            </div>
            <div className="resume-preview-wrapper">
              {resumeData && resumeData.data && <ResumePreview data={resumeData.data} />}
            </div>
          </div>
        );
      
      default:
        return <div>no slected tap.</div>;
    }
  };

  return (
    <div className="resume-editor-page">
      <div className="editor-header">
        <h1>Resume Editor</h1>
        <div className="editor-tabs">
          <button 
            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => handleTabChange('chat')}
          >
            Full Resume Chat
          </button>
          <button 
            className={`tab-btn ${activeTab === 'chunk-editor' ? 'active' : ''}`}
            onClick={() => handleTabChange('chunk-editor')}
          >
            Section Editor
          </button>
          <button 
            className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => handleTabChange('preview')}
          >
            Preview & Export
          </button>
        </div>
      </div>
      
      <div className="editor-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ResumeEditor;