import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './App.css';

const validationSchema = Yup.object({
  studentName: Yup.string()
    .required('Student Name is required')
    .min(2, 'Student Name must be at least 2 characters'),
  password: Yup.string()
    .required('Password is required')
    .max(12, 'Password must be at most 12 characters')
});

function StudentLogin() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('/api/students/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.studentName,
          password: values.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Login failed');
        return;
      }

      const data = await response.json();
      sessionStorage.setItem('student_id', data.id);
      sessionStorage.setItem('student_name', data.name);
      navigate('/student-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Student Login</h2>
        
        <Formik
          initialValues={{ studentName: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="studentName">Student Name:</label>
              <Field
                type="text"
                id="studentName"
                name="studentName"
                className="form-input"
              />
              <ErrorMessage name="studentName" component="div" style={{color: '#027373', fontSize: '14px', marginTop: '5px'}} />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <Field
                type="password"
                id="password"
                name="password"
                className="form-input"
              />
              <ErrorMessage name="password" component="div" style={{color: '#027373', fontSize: '14px', marginTop: '5px'}} />
            </div>
            
            <button type="submit" className="login-button">
              Login
            </button>
          </Form>
        </Formik>
        
        <div style={{display: 'flex', gap: '10px'}}>
          <button onClick={() => navigate('/student-signup')} className="back-button" style={{flex: 1}}>
            Sign Up
          </button>
          <button onClick={() => navigate('/')} className="back-button" style={{flex: 1}}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;