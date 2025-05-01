import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ResumeForm from './pages/ResumeForm';
import ResumeEditor from './pages/ResumeEditor';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <div className="content-container">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<ResumeForm />} />
            <Route path="/basicinfos" element={<ResumeForm />} />
            <Route path="/resume_preview" element={<ResumeEditor />} />
            <Route path="/resume_editor/:id" element={<ResumeEditor />} />
            <Route path="/my-page" element={<div>My Page Content</div>} />
            <Route path="/schedule" element={<div>Schedule Content</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App; 