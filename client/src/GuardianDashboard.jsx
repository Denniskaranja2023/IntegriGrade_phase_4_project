import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import baseUrl from './api';

function GuardianDashboard() {
  const navigate = useNavigate();
  const [guardianData, setGuardianData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGuardianData();
  }, []);

  const fetchGuardianData = async () => {
    try {
      const guardianId = sessionStorage.getItem('guardian_id');
      if (!guardianId) {
        sessionStorage.clear();
        navigate('/guardian-login');
        return;
      }

      const response = await fetch(`${baseUrl}/api/guardians/${guardianId}/students`);
      if (!response.ok) {
        throw new Error('Failed to fetch guardian data');
      }

      const studentsData = await response.json();
      setStudents(studentsData);
      
      setGuardianData({
        name: sessionStorage.getItem('guardian_name') || 'Guardian',
        guardianId: guardianId
      });
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/api/guardians/logout`, { method: 'POST' });
      sessionStorage.removeItem('guardian_id');
      sessionStorage.removeItem('guardian_name');
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <h2>Error: {error}</h2>
          <button onClick={() => navigate('/guardian-login')} className="login-button">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!guardianData) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Guardian Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="student-info-card">
          <h2>Guardian Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <strong>Name:</strong> {guardianData.name}
            </div>
            <div className="info-item">
              <strong>Guardian ID:</strong> {guardianData.guardianId}
            </div>
            <div className="info-item">
              <strong>Total Dependants:</strong> {students.length}
            </div>
          </div>
        </div>

        {students.length > 0 ? (
          students.map(student => (
            <div key={student.id} className="grades-card">
              <div className="student-header">
                <div className="student-image">
                  {student.image ? (
                    <img src={student.image} alt={student.name} className="profile-image" />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="student-basic-info">
                  <h2>{student.name}</h2>
                  <div className="fee-status">
                    <strong>Fee Status:</strong> 
                    <span className={`fee-badge ${student.fee_status ? 'paid' : 'pending'}`}>
                      {student.fee_status ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="student-info-section">
                <h3>Class Teacher Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Name:</strong> {student.classteacher?.name || 'Not Assigned'}
                  </div>
                  <div className="info-item">
                    <strong>Phone:</strong> {student.classteacher?.phone_number || 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="student-info-section">
                <h3>General Report</h3>
                <div className="report-content">
                  {student.general_report || 'No general report available yet.'}
                </div>
              </div>

              <div className="student-info-section">
                <h3>Academic Performance</h3>
                <div className="grades-table">
                  <div className="table-header">
                    <div>Subject</div>
                    <div>Grade</div>
                    <div>Teacher</div>
                  </div>
                  {student.student_subjects && student.student_subjects.length > 0 ? (
                    student.student_subjects.map(subject => (
                      <div key={subject.id} className="table-row">
                        <div>{subject.subject?.name || 'N/A'}</div>
                        <div className="grade-badge">{subject.grade || 'Not Graded'}</div>
                        <div>{subject.teacher?.name || 'N/A'}</div>
                      </div>
                    ))
                  ) : (
                    <div className="table-row">
                      <div style={{gridColumn: '1 / -1', textAlign: 'center', color: '#027373'}}>
                        No grades available yet
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="grades-card">
            <h2>No Students Found</h2>
            <p>You don't have any students assigned to your account yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuardianDashboard;