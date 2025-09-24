import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Home(){
  const navigate = useNavigate();

  return (
    <>
     <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-integri">Integri</span>
        <span className="brand-grade">Grade</span>
      </div>
    </nav>
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
        
        <button className="role-button">
          Student
        </button>
        
        <button className="role-button">
          Guardian
        </button>
        
        <button className="role-button" onClick={() => navigate('/teacher-login')}>
          Teacher
        </button>
      </div>
    </div>
    </>
  );
};

export default Home;