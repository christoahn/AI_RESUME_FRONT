import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../assets/Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleReset = () => {
    localStorage.removeItem('basic_info');
    localStorage.removeItem('education');
    localStorage.removeItem('work_experience');
    localStorage.removeItem('projects');
    localStorage.removeItem('skills');
    localStorage.removeItem('resumeHTML');
    
    navigate('/');
  };

  return (
    <header className="main-header">
      <div className="logo">
        <h1>PE<span className="accent">A</span>K UP</h1>
      </div>
      <nav className="main-nav">
        <ul>
          <li>
            <NavLink to="/resume" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              RESUME
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-page" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              MY PAGE
            </NavLink>
          </li>
          <li>
            <NavLink to="/schedule" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              SCHEDULE
            </NavLink>
          </li>
          <li>
            <button className="contact-btn">Contact</button>
          </li>
          <li>
            <button className="reset-btn" onClick={handleReset}>Reset Resume</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header; 