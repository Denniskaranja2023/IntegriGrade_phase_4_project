import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherStudentCard from './TeacherStudentCard.jsx';
import './App.css';

const TeacherStudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshPage, setRefreshPage] = useState(false);

  const teacherId = localStorage.getItem('teacher_id');

  const handleLogout = () => {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      fetch('/api/teachers/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(() => {
        localStorage.removeItem('teacher_id');
        navigate('/teacher-login');
      })
      .catch(error => console.error('Logout error:', error));
    }
  };

  useEffect(() => {
    fetch(`/api/teachers/${teacherId}/students`)
      .then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();
          setStudents(data);
          setLoading(false);
        } else {
          setError('Error fetching students');
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Error fetching students');
        setLoading(false);
      });
  }, [refreshPage, teacherId]);

  if (loading) {
    return <div style={{ color: '#027373' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: '#027373' }}>{error}</div>;
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-integri">Integri</span>
          <span className="brand-grade">Grade</span>
        </div>
        
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </nav>
      
      <div className="teacher-student-container">
        <h1 className="teacher-title">My Students</h1>
        <h2 className="student-count">Total Students: {students.length}</h2>
        
        <div className="teacher-student-grid">
          {students && students.length > 0 ? (
            students.map(student => (
              <TeacherStudentCard 
                key={student.id} 
                student={student} 
                teacherId={teacherId}
                setRefreshPage={setRefreshPage} 
                refreshPage={refreshPage} 
              />
            ))
          ) : (
            <p className="no-students">No students assigned</p>
          )}
        </div>
      </div>
    </>
  );
};

export default TeacherStudentList;