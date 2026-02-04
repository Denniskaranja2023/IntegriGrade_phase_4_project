import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import './App.css';
import baseUrl from './api';

const StudentSignup = () => {
  const navigate = useNavigate();
  const [classteachers, setClassteachers] = useState([]);
  const [guardians, setGuardians] = useState([]);

  useEffect(() => {
    fetch(`${baseUrl}/api/classteachers`)
      .then(res => res.json())
      .then(data => setClassteachers(data))
      .catch(error => console.error('Error fetching classteachers:', error));

    fetch(`${baseUrl}/api/guardians`)
      .then(res => res.json())
      .then(data => setGuardians(data))
      .catch(error => console.error('Error fetching guardians:', error));
  }, []);

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    password: yup.string().required('Password is required').min(7, 'Password must be at least 7 characters'),
    classteacher_id: yup.number().required('Classteacher is required'),
    guardian_id: yup.number().required('Guardian is required'),
    image: yup.string()
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
      classteacher_id: '',
      guardian_id: '',
      image: ''
    },
    validationSchema,
    onSubmit: (values) => {
      fetch(`${baseUrl}/api/students/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      .then(res => {
        if (res.status === 201) {
          alert('Student account created successfully');
          formik.resetForm();
          navigate('/student-login');
        } else {
          return res.json().then(data => {
            throw new Error(data.error || 'Signup failed');
          });
        }
      })
      .catch(error => {
        alert('Signup failed: ' + error.message);
      });
    }
  });

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-integri">Integri</span>
          <span className="brand-grade">Grade</span>
        </div>
      </nav>
      
      <div className="login-container">
        <div className="login-form">
          <h2 className="login-title">Student Signup</h2>
          
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                className="form-input"
                required
              />
              <p className="error-message">{formik.errors.name}</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                className="form-input"
                required
              />
              <p className="error-message">{formik.errors.password}</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="classteacher_id" className="form-label">Select Classteacher:</label>
              <select
                id="classteacher_id"
                name="classteacher_id"
                value={formik.values.classteacher_id}
                onChange={formik.handleChange}
                className="form-input"
                required
              >
                <option value="">Choose a classteacher</option>
                {classteachers.map(ct => (
                  <option key={ct.id} value={ct.id}>{ct.name}</option>
                ))}
              </select>
              <p className="error-message">{formik.errors.classteacher_id}</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="guardian_id" className="form-label">Select Guardian:</label>
              <select
                id="guardian_id"
                name="guardian_id"
                value={formik.values.guardian_id}
                onChange={formik.handleChange}
                className="form-input"
                required
              >
                <option value="">Choose a guardian</option>
                {guardians.map(guardian => (
                  <option key={guardian.id} value={guardian.id}>{guardian.name}</option>
                ))}
              </select>
              <p className="error-message">{formik.errors.guardian_id}</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="image" className="form-label">Image URL (optional):</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formik.values.image}
                onChange={formik.handleChange}
                className="form-input"
              />
              <p className="error-message">{formik.errors.image}</p>
            </div>
            
            <button type="submit" className="login-button">
              Sign Up
            </button>
          </form>
          
          <button onClick={() => navigate('/student-login')} className="back-button">
            Back to Login
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentSignup;