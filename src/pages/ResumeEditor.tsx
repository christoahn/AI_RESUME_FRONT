import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResumeData, ChatMessage } from '../types';
import resumeApi from '../api/resumeApi';
import { handleApiError } from '../utils/api';
import html2pdf from 'html2pdf.js';
import '../assets/ResumeEditor.css';
import ResumePreview from '../components/ResumePreview';

const ResumeEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // 이력서 데이터 상태
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  // 로딩 상태
  const [loading, setLoading] = useState(true);
  // 에러 상태
  const [error, setError] = useState<string | null>(null);
  // 채팅 메시지 목록
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  // 현재 입력 중인 메시지
  const [currentMessage, setCurrentMessage] = useState('');
  // 채팅 중인지 여부
  const [isChatting, setIsChatting] = useState(false);

  // 이력서 데이터 가져오기
  const fetchResumeData = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await resumeApi.getResume(parseInt(id));
      setResumeData(data);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResumeData();
  }, [fetchResumeData]);

  // 이력서 업데이트 처리
  const handleUpdateResume = async (updatedData: ResumeData) => {
    if (!id) return;
    
    try {
      setError(null);
      const data = await resumeApi.updateResume(parseInt(id), updatedData);
      setResumeData(data);
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  // 채팅 처리 함수
  const handleChat = async () => {
    if (!resumeData || !currentMessage.trim()) return;
    
    try {
      setIsChatting(true);
      setError(null);
      
      // 사용자 메시지 추가
      const userMessage: ChatMessage = {
        role: 'user',
        content: currentMessage,
        timestamp: new Date().toISOString()
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      setCurrentMessage('');
      
      // AI 응답 받기
      const response = await resumeApi.chatWithAI(currentMessage, resumeData);
      
      // AI 메시지 추가
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

  // PDF 다운로드 처리
  const handleDownloadPDF = async () => {
    if (!resumeData) return;
    
    try {
      setError(null);
      const element = document.getElementById('resume-preview');
      if (!element) throw new Error('Resume preview element not found');
      
      const opt = {
        margin: 1,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  // DOCX 다운로드 처리
  const handleDownloadDOCX = async () => {
    if (!resumeData) return;
    
    try {
      setError(null);
      const element = document.getElementById('resume-preview');
      if (!element) throw new Error('Resume preview element not found');
      
      const html = element.innerHTML;
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
      {/* 채팅 섹션 */}
      <div className="chat-section">
        <div className="chat-container">
          {/* 채팅 헤더 */}
          <div className="chat-header">
            <h2>AI Resume Assistant</h2>
            <p>Chat with our AI to improve your resume</p>
          </div>

          {/* 채팅 메시지 영역 */}
          <div className="chat-messages">
            {chatMessages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                {message.content}
              </div>
            ))}
          </div>
          
          {/* 채팅 입력 영역 */}
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
      
      {/* 이력서 미리보기 섹션 */}
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
          />
        )}
      </div>
    </div>
  );
};

export default ResumeEditor; 