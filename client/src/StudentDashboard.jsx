import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './App.css';
import baseUrl from './api';

const updateValidationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters'),
  image: Yup.string()
    .url('Must be a valid URL')
});

function StudentDashboard() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const studentId = sessionStorage.getItem('student_id');
      if (!studentId) {
        sessionStorage.clear();
        navigate('/student-login');
        return;
      }

      // Fetch student profile
      const profileResponse = await fetch(`${baseUrl}/api/students/${studentId}/profile`);
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch student profile');
      }
      const profileData = await profileResponse.json();
      setStudentData(profileData);

      // Fetch student subjects
      const subjectsResponse = await fetch(`${baseUrl}/api/students/${studentId}/subjects`);
      if (!subjectsResponse.ok) {
        throw new Error('Failed to fetch student subjects');
      }
      const subjectsData = await subjectsResponse.json();
      setGrades(subjectsData);
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      const studentId = sessionStorage.getItem('student_id');
      const updateData = {};
      
      if (values.name !== studentData.name) updateData.name = values.name;
      if (values.password) updateData.password = values.password;
      if (values.image !== studentData.image) updateData.image = values.image;
      
      if (Object.keys(updateData).length === 0) {
        alert('No changes to update');
        return;
      }

      const response = await fetch(`${baseUrl}/api/students/${studentId}/profile/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Update failed');
        return;
      }

      const data = await response.json();
      alert(data.message);
      setShowUpdateForm(false);
      
      // Update session storage if name changed
      if (updateData.name) {
        sessionStorage.setItem('student_name', data.name);
      }
      
      // Refresh the data to reflect changes
      fetchStudentData();
    } catch (error) {
      console.error('Update error:', error);
      alert('Update failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/api/students/logout`, { method: 'POST' });
      sessionStorage.removeItem('student_id');
      sessionStorage.removeItem('student_name');
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
          <button onClick={() => navigate('/student-login')} className="login-button">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Student Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="student-info-card">
          <div className="student-header">
            <div className="student-image">
              {studentData.image ? (
                <img src={studentData.image} alt={studentData.name} className="profile-image" />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>
            <div className="student-basic-info">
              <h2>{studentData.name}</h2>
              <div className="fee-status">
                <strong>Fee Status:</strong> 
                <span className={`fee-badge ${studentData.fee_status ? 'paid' : 'pending'}`}>
                  {studentData.fee_status ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
            <button onClick={() => setShowUpdateForm(!showUpdateForm)} className="update-button">
              {showUpdateForm ? 'Cancel' : 'Update Profile'}
            </button>
          </div>

          {showUpdateForm && (
            <div className="update-form-section">
              <h3>Update Profile</h3>
              <Formik
                initialValues={{
                  name: studentData.name || '',
                  password: '',
                  image: studentData.image || ''
                }}
                validationSchema={updateValidationSchema}
                onSubmit={handleUpdateProfile}
              >
                <Form>
                  <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="form-input"
                    />
                    <ErrorMessage name="name" component="div" style={{color: '#027373', fontSize: '14px', marginTop: '5px'}} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">New Password (leave blank to keep current):</label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="form-input"
                    />
                    <ErrorMessage name="password" component="div" style={{color: '#027373', fontSize: '14px', marginTop: '5px'}} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="image">Profile Image URL:</label>
                    <Field
                      type="url"
                      id="image"
                      name="image"
                      className="form-input"
                    />
                    <ErrorMessage name="image" component="div" style={{color: '#027373', fontSize: '14px', marginTop: '5px'}} />
                  </div>

                  <button type="submit" className="login-button">
                    Update Profile
                  </button>
                </Form>
              </Formik>
            </div>
          )}

          {studentData.general_report && (
            <div className="student-info-section">
              <h3>General Report</h3>
              <div className="report-content">
                {studentData.general_report}
              </div>
            </div>
          )}
        </div>

        <div className="grades-card">
          <h2>My Grades</h2>
          <div className="grades-table">
            <div className="table-header">
              <div>Subject</div>
              <div>Grade</div>
              <div>Score</div>
              <div>Teacher</div>
              <div>Date</div>
            </div>
            {grades.length > 0 ? grades.map(grade => (
              <div key={grade.id} className="table-row">
                <div>{grade.subject?.name || 'N/A'}</div>
                <div className="grade-badge">{grade.grade || 'Not Graded'}</div>
                <div>-</div>
                <div>{grade.teacher?.name || 'N/A'}</div>
                <div>-</div>
              </div>
            )) : (
              <div className="table-row">
                <div style={{gridColumn: '1 / -1', textAlign: 'center', color: '#027373'}}>
                  No grades available yet
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;