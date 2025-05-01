import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ResumeData, ResumeDataResponse, ApiResponse, ChatMessage } from '../types';
import resumeApi from '../api/resumeApi';
import { handleApiError } from '../utils/api';
import html2pdf from 'html2pdf.js';
import '../assets/ResumeEditor.css';
import ResumePreview from '../components/ResumePreview';

const ResumeEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get resume_id from either URL parameter or query parameter
  const getResumeId = useCallback(() => {
    // First try URL parameter
    if (id) {
      console.log("Using URL parameter id:", id);
      return id;
    }
    
    // Then try query parameter
    const queryParams = new URLSearchParams(location.search);
    const queryId = queryParams.get('resume_id');
    if (queryId) {
      console.log("Using query parameter resume_id:", queryId);
      return queryId;
    }
    
    console.warn("No resume ID found in URL or query parameters");
    return null;
  }, [id, location.search]);
  
  // Resume data state
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  // Loading state
  const [loading, setLoading] = useState(true);
  // Error state
  const [error, setError] = useState<string | null>(null);
  // Chat message list
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  // Current input message
  const [currentMessage, setCurrentMessage] = useState('');
  // Chatting status
  const [isChatting, setIsChatting] = useState(false);

  const convertResponseToResumeData = (response: ResumeDataResponse): ResumeData => {
    return {
      name: response.name,
      email: response.email,
      phone: response.phone,
      address: response.address,
      projects: Object.values(response.projects || {}),
      jobs: Object.values(response.jobs || {}),
      educations: Object.values(response.educations || {}),
      researchs: Object.values(response.researchs || {})
    };
  };

  // Fetch resume data
  const fetchResumeData = useCallback(async () => {
    const resumeId = getResumeId();
    if (!resumeId) {
      setError("Resume ID not found in URL");
      setLoading(false);
      return;
    }
    
    try {
      console.log(`Fetching resume data for ID: ${resumeId}`);
      setLoading(true);
      setError(null);
      const response = await resumeApi.getResume(parseInt(resumeId));
      console.log("Resume data response:", response);
      
      if (response && 'data' in response && response.data) {
        // Use convertResponseToResumeData function to properly convert the data
        setResumeData(convertResponseToResumeData(response.data));
      } else {
        setError("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  }, [getResumeId]);

  useEffect(() => {
    fetchResumeData();
  }, [fetchResumeData]);

  // Handle resume update
  const handleUpdateResume = async (updatedData: ResumeData) => {
    const resumeId = getResumeId();
    if (!resumeId) {
      setError("Resume ID not found in URL");
      return;
    }
    
    try {
      console.log(`Updating resume data for ID: ${resumeId}`);
      setError(null);
      const response = await resumeApi.updateResume(parseInt(resumeId), updatedData);
      console.log("Resume update response:", response);
      
      if (response && 'data' in response && response.data) {
        // Use convertResponseToResumeData function to properly convert the data
        setResumeData(convertResponseToResumeData(response.data));
      } else {
        setError("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error updating resume:", error);
      setError(handleApiError(error));
    }
  };

  // Handle chat
  const handleChat = async () => {
    if (!resumeData || !currentMessage.trim()) return;
    
    try {
      setIsChatting(true);
      setError(null);
      
      // Add user message
      const userMessage: ChatMessage = {
        role: 'user',
        content: currentMessage,
        timestamp: new Date().toISOString()
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      setCurrentMessage('');
      
      // Get AI response
      const response = await resumeApi.chatWithAI(currentMessage, resumeData);
      
      // Add AI message
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString()
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setIsChatting(false);
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!resumeData) return;
    
    try {
      setError(null);
      const element = document.getElementById('resume-preview');
      if (!element) throw new Error('Resume preview element not found');
      
      const opt = {
        margin: 10,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: true,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait'
        }
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  // Handle DOCX download
  const handleDownloadDOCX = async () => {
    if (!resumeData) return;
    
    try {
      setError(null);
      const element = document.getElementById('resume-preview');
      if (!element) throw new Error('Resume preview element not found');
      
      // Include only inline styles
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              ${Array.from(document.styleSheets)
                .filter(sheet => !sheet.href) // Exclude external stylesheets
                .map(sheet => {
                  try {
                    return Array.from(sheet.cssRules)
                      .map(rule => rule.cssText)
                      .join('\n');
                  } catch (e) {
                    return '';
                  }
                })
                .join('\n')}
            </style>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `;

      const blob = await resumeApi.generateDocx(html);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const handlePrint = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        // If popup is blocked, print in current window
        window.print();
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
            ${document.getElementById('resume-preview')?.innerHTML || ''}
          </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.onafterprint = () => {
            printWindow.close();
          };
        }, 500);
      };
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!resumeData) {
    return <div>No resume data found</div>;
  }

  return (
    <div className="resume-editor-container">
      {/* Chat section */}
      <div className="chat-section">
        <div className="chat-container">
          {/* Chat header */}
          <div className="chat-header">
            <h2>AI Resume Assistant</h2>
            <p>Chat with our AI to improve your resume</p>
          </div>

          {/* Chat messages area */}
          <div className="chat-messages">
            {chatMessages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                {message.content}
              </div>
            ))}
          </div>
          
          {/* Chat input area */}
          <div className="chat-input">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Ask about your resume..."
              disabled={isChatting}
            />
            <button onClick={handleChat} disabled={isChatting}>
              {isChatting ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Resume preview section */}
      <div className="preview-section">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : resumeData ? (
          <ResumePreview 
            resumeData={resumeData}
            handleDownloadPDF={handleDownloadPDF}
            handleDownloadDOCX={handleDownloadDOCX}
            handlePrint={handlePrint}
          />
        ) : (
          <div className="no-data">No resume data found</div>
        )}
      </div>
    </div>
  );
};

export default ResumeEditor; 