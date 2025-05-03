import React, { useState, useEffect, useRef } from 'react';
import resumeApi from '../api/resumeApi';
import '../assets/ChunkEditor.css';

// 채팅 메시지 타입 정의
interface ChatMessage {
  content: string;
  isUser: boolean;
}

// 청크 데이터 타입 정의
interface ChunkData {
  id: number;
  name: string;
}

// 청크 타입별 목록 타입 정의 
interface ChunksByType {
  projects: ChunkData[];
  jobs: ChunkData[];
  researches: ChunkData[];
  educations: ChunkData[];
}

// 컴포넌트 props 타입 정의
interface ChunkEditorProps {
  resumeId: number;
  onChunkUpdated?: (chunkType: string, chunkId: number, updatedContent: string) => void;
}

// 청크 편집기 타입
type ChunkType = 'projects' | 'jobs' | 'researches' | 'educations';

// 청크 매핑
const chunkTypeLabels: Record<ChunkType, string> = {
  'projects': 'Projects',
  'jobs': 'Work Experience',
  'researches': 'Research',
  'educations': 'Education'
};

/**
 * 이력서 청크 편집 컴포넌트
 * 사용자가 특정 청크(프로젝트, 직업 등)를 선택하여 AI와 대화를 통해 편집할 수 있는 인터페이스 
 * @param {number} resumeId - 이력서 ID
 * @param {Function} onChunkUpdated - 청크가 업데이트될 때 호출되는 콜백 함수 (나중에 지워도 됨)
 */
const ChunkEditor: React.FC<ChunkEditorProps> = ({ resumeId, onChunkUpdated }) => {
  // 상태 관리
  const [chunksByType, setChunksByType] = useState<ChunksByType>({
    projects: [],
    jobs: [],
    researches: [],
    educations: []
  });
  const [selectedType, setSelectedType] = useState<ChunkType | null>(null);
  const [selectedChunk, setSelectedChunk] = useState<ChunkData | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 초기 데이터 로드
  useEffect(() => {
    const fetchChunks = async () => {
      setIsLoading(true);
      try {
        const chunks = await resumeApi.getResumeChunks(resumeId);
        setChunksByType(chunks);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch chunks:', err);
        setError('Failed to load chunk list.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChunks();
  }, [resumeId]);
  
  // 새 메시지가 추가될 때마다 스크롤 아래로 이동
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // 청크 유형 선택 처리
  const handleTypeSelect = (type: ChunkType) => {
    setSelectedType(type);
    setSelectedChunk(null);
    
    // 현재 선택된 청크 유형에 대한 초기 메시지 설정
    setMessages([
      {
        content: `Please select an item from the ${chunkTypeLabels[type]} section to edit.`,
        isUser: false
      }
    ]);
  };
  
  // 특정 청크 선택 처리
  const handleChunkSelect = (chunk: ChunkData) => {
    setSelectedChunk(chunk);
    
    // 청크 선택 시 초기 메시지 설정
    setMessages([
      {
        content: `Please enter how you'd like to modify '${chunk.name}'. For example, you can say "Add more technical details to this project description".`,
        isUser: false
      }
    ]);
    
    // 입력 필드에 포커스
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // 메시지 전송 처리
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedType || !selectedChunk) return;
    
    // 사용자 메시지 추가
    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { content: userMessage, isUser: true }]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // AI에 메시지 전송 및 청크 수정
      const result = await resumeApi.editChunkWithAI(
        resumeId,
        selectedType,
        selectedChunk.id,
        userMessage
      );
      
      if (result.status === 'success' && result.updatedDescription) {
        // 성공적으로 업뎃된 경우
        setMessages(prev => [
          ...prev,
          {
            content: `'${selectedChunk.name}' has been updated successfully. Feel free to continue making additional edits.`,
            isUser: false
          }
        ]);
        
        // parent 컴포넌트에 업데이트 알림 (if needed) 
        if (onChunkUpdated && selectedType) {
          onChunkUpdated(selectedType, selectedChunk.id, result.updatedDescription);
        }
      } else {
        // 업뎃 실패
        setMessages(prev => [
          ...prev,
          {
            content: result.message || 'An error occurred during the update.',
            isUser: false
          }
        ]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => [
        ...prev,
        {
          content: 'An error occurred while sending your message. Please try again.',
          isUser: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 엔터 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="chunk-editor-container">
      <div className="chunk-editor-sidebar">
        <h3>Select Section</h3>
        <div className="chunk-types">
          {Object.entries(chunkTypeLabels).map(([type, label]) => (
            <button
              key={type}
              className={`chunk-type-btn ${selectedType === type ? 'active' : ''}`}
              onClick={() => handleTypeSelect(type as ChunkType)}
            >
              {label}
            </button>
          ))}
        </div>
        
        {selectedType && (
          <div className="chunk-list">
            <h4>{chunkTypeLabels[selectedType]} Items</h4>
            {chunksByType[selectedType].length > 0 ? (
              <ul>
                {chunksByType[selectedType].map(chunk => (
                  <li
                    key={chunk.id}
                    className={selectedChunk?.id === chunk.id ? 'active' : ''}
                    onClick={() => handleChunkSelect(chunk)}
                  >
                    {chunk.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-chunks-message">No items available for selection.</p>
            )}
          </div>
        )}
      </div>
      
      <div className="chunk-editor-chat">
        {selectedChunk ? (
          <>
            <div className="chat-header">
              <h3>Editing {selectedChunk.name}</h3>
            </div>
            
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.isUser ? 'user-message' : 'ai-message'}`}
                >
                  <div className="message-content">{msg.content}</div>
                </div>
              ))}
              
              {isLoading && (
                <div className="message ai-message">
                  <div className="message-content loading">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="chat-input">
              <input
                type="text"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe how you'd like to modify this section..."
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
              >
                Send
              </button>
            </div>
            
            <div className="chat-suggestions">
              <p>Suggested edits:</p>
              <div className="suggestion-buttons">
                <button onClick={() => setInputValue("Use more professional terminology")}>
                  More professional
                </button>
                <button onClick={() => setInputValue("Emphasize achievements more")}>
                  Highlight achievements
                </button>
                <button onClick={() => setInputValue("Make this section more concise")}>
                  Make it concise
                </button>
                <button onClick={() => setInputValue("Add numbers or statistics")}>
                  Add metrics
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">
            <p>Please select an item to edit.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChunkEditor; 