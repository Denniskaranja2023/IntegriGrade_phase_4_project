import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './App.css';
import baseUrl from './api';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Guardian Name is required')
    .min(2, 'Guardian Name must be at least 2 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

function GuardianLogin() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`${baseUrl}/api/guardians/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          password: values.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Login failed');
        return;
      }

      const data = await response.json();
      sessionStorage.setItem('guardian_id', data.id);
      sessionStorage.setItem('guardian_name', data.name);
      navigate('/guardian-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Guardian Login</h2>
        
        <Formik
          initialValues={{ name: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="name">Guardian Name:</label>
              <Field
                type="text"
                id="name"
                name="name"
                className="form-input"
              />
              <ErrorMessage name="name" component="div" style={{color: '#027373', fontSize: '14px', marginTop: '5px'}} />
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
          <button onClick={() => navigate('/guardian-signup')} className="back-button" style={{flex: 1}}>
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

export default GuardianLogin;