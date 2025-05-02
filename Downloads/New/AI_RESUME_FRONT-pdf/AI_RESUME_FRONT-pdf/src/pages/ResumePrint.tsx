import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import resumeApi from '../api/resumeApi';

// 인쇄 전용 페이지 스타일
const printStyles = `
  body {
    font-family: 'Arial', sans-serif;
    line-height: 1.5;
    color: #333;
    padding: 20px;
    margin: 0;
    background-color: white;
  }
  h1 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
    text-align: center;
  }
  h2 {
    font-size: 1.4rem;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 0.35rem;
    color: #2980b9;
    text-align: center;
  }
  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #444;
  }
  p {
    margin-bottom: 0.8rem;
  }
  ul {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
  li {
    margin-bottom: 0.35rem;
  }
  .resume-section {
    margin-bottom: 20px;
  }
  @media print {
    body {
      padding: 0;
    }
    button {
      display: none !important;
    }
  }
`;

const ResumePrint: React.FC = () => {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('resume_id');
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResume = async () => {
      if (resumeId) {
        try {
          const data = await resumeApi.getResume(Number(resumeId));
          setResumeData(data);
        } catch (error) {
          console.error('Error fetching resume data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResume();
  }, [resumeId]);

  useEffect(() => {
    // 페이지 로드 후 자동 인쇄
    if (resumeData && !loading) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [resumeData, loading]);

  const renderContent = () => {
    if (loading) {
      return <div>로딩 중...</div>;
    }

    if (!resumeData || !resumeData.data) {
      return <div>이력서 데이터를 찾을 수 없습니다.</div>;
    }

    const data = resumeData.data;

    return (
      <div className="resume-document">
        <h1>{data.name}</h1>
        <p>Email: {data.email} | Phone: {data.phone} | Address: {data.address}</p>

        {data.projects && Object.values(data.projects).length > 0 && (
          <section>
            <h2>Projects</h2>
            {Object.values(data.projects).map((proj: any, idx: number) => {
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
              
              return (
                <div key={idx} className="resume-section">
                  <h3>{proj.name}</h3>
                  {proj.position && <p>Position: {proj.position}</p>}
                  <p>Duration: {proj.duration}</p>
                  {Array.isArray(desc) ? (
                    <ul>
                      {desc.map((d: string, i: number) => <li key={i}>{d}</li>)}
                    </ul>
                  ) : (
                    <p>{desc}</p>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {data.jobs && Object.values(data.jobs).length > 0 && (
          <section>
            <h2>Work Experience</h2>
            {Object.values(data.jobs).map((job: any, idx: number) => {
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
              
              return (
                <div key={idx} className="resume-section">
                  <h3>{job.name} - {job.position}</h3>
                  <p>Duration: {job.duration}</p>
                  {Array.isArray(desc) ? (
                    <ul>
                      {desc.map((d: string, i: number) => <li key={i}>{d}</li>)}
                    </ul>
                  ) : (
                    <p>{desc}</p>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {data.researches && Object.values(data.researches).length > 0 && (
          <section>
            <h2>Research</h2>
            {Object.values(data.researches).map((res: any, idx: number) => {
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
              
              return (
                <div key={idx} className="resume-section">
                  <h3>{res.name}</h3>
                  <p>Duration: {res.duration}</p>
                  {Array.isArray(desc) ? (
                    <ul>
                      {desc.map((d: string, i: number) => <li key={i}>{d}</li>)}
                    </ul>
                  ) : (
                    <p>{desc}</p>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {data.educations && Object.values(data.educations).length > 0 && (
          <section>
            <h2>Education</h2>
            {Object.values(data.educations).map((edu: any, idx: number) => {
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
              
              return (
                <div key={idx} className="resume-section">
                  <h3>{edu.name}</h3>
                  <p>{edu.degree} ({edu.duration})</p>
                  <p>Major: {edu.major}</p>
                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  {Array.isArray(desc) ? (
                    <ul>
                      {desc.map((d: string, i: number) => <li key={i}>{d}</li>)}
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
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <style>{printStyles}</style>
      {renderContent()}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => window.print()} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6c757d', 
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          인쇄하기
        </button>
        <button 
          onClick={() => window.close()} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#343a40', 
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginLeft: '10px',
            cursor: 'pointer'
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default ResumePrint; 