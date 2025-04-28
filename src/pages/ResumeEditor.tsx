import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [resumeHTML, setResumeHTML] = useState('');
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const userInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedResumeHTML = localStorage.getItem('resumeHTML');
    const basicInfo = JSON.parse(localStorage.getItem('basic_info') || '{}');
    
    if (storedResumeHTML) {
      setResumeHTML(storedResumeHTML);
    } else {
      navigate('/');
    }

    if (basicInfo.name && messages.length === 1) {
      setMessages([
        { 
          content: `Hello, ${basicInfo.name}! I'm your resume assistant. I can help you optimize your resume. What would you like to improve?`, 
          isUser: false 
        }
      ]);
    }
  }, [navigate, messages.length]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addMessage = (content: string, isUser: boolean) => {
    setMessages((prevMessages: ChatMessage[]) => [...prevMessages, { content, isUser }]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    addMessage(inputValue, true);
    setInputValue('');
    setIsTyping(true);
    
    try {
      const response = await resumeApi.chatWithAI(inputValue, resumeHTML);
      setIsTyping(false);
      
      if (response.status === 'success') {
        addMessage(response.response, false);
        
        if (response.updated_html) {
          setResumeHTML(response.updated_html);
          localStorage.setItem('resumeHTML', response.updated_html);
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
    element.innerHTML = resumeHTML;
    
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
      const blob = await resumeApi.generateDocx(resumeHTML);
      
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
                padding: 0;
              }
              @media print {
                body { margin: 0; padding: 20mm; }
              }
            </style>
          </head>
          <body>
            ${resumeHTML}
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
        <ResumePreview 
          resumeHTML={resumeHTML}
          handleDownloadPDF={handleDownloadPDF}
          handleDownloadDOCX={handleDownloadDOCX}
        />
      </div>
    </div>
  );
};

export default ResumeEditor; 