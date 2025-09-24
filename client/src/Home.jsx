import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Home(){
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">
        Welcome to <span className="integri">Integri</span><span className="grade">Grade</span>
      </h1>
      
      <p className="home-subtitle">
        Choose a role
      </p>
      
      <div className="button-container">
        <button className="role-button" onClick={() => navigate('/classteacher-login')}>
          Classteacher
        </button>
        
        <button className="role-button" onClick={() => navigate('/student-login')}>
          Student
        </button>
        
        <button className="role-button" onClick={() => navigate('/guardian-login')}>
          Guardian
        </button>
        
        <button className="role-button">
          Teacher
        </button>
      </div>
    </div>
  );
};

export default Home;