import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import './App.css';
import baseUrl from './api';

const TeacherLogin = () => {
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is always required'),
    password: yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      password: ''
    },
    validationSchema,
    onSubmit: (values) => {
      fetch(`${baseUrl}/api/teachers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error('Invalid credentials');
        }
      })
      .then(data => {
        alert('Login successful');
        sessionStorage.setItem('teacher_id', data.id);
        document.cookie = `teacher_session=${data.id}; path=/`;
        formik.resetForm();
        navigate('/teacher-student-list');
      })
      .catch(error => {
        alert('Login failed: ' + error.message);
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
          <h2 className="login-title">Teacher Login</h2>
          
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
            
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
          
          <button onClick={() => navigate('/teacher-signup')} className="back-button">
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
};

export default TeacherLogin;