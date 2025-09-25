import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const ClassTeacherNavbar = () => {
  const navigate = useNavigate();

  function handleLogout(){
    const confirmMessage= confirm("Are you sure you want to log out?")
    if (!confirmMessage) return
    sessionStorage.removeItem("classteacher_id");
    fetch('/api/classteachers/logout',{method:"POST"})
    .then(res=>{
      if (res.status===200){
      navigate('/classteacher-login');
      }
      else{
      alert("Error Logging out")
      }
    }).catch(error=> console.error("Error", error))
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-integri">Integri</span>
        <span className="brand-grade">Grade</span>
      </div>
      
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </nav>
  );
};

export default ClassTeacherNavbar;