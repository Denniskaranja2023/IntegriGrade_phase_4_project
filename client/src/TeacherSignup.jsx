import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import './App.css';
import baseUrl from './api';

const TeacherSignup = () => {
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    password: yup.string().required('Password is required').min(7, 'Password must be at least 7 characters'),
    gender: yup.string(),
    age: yup.number().positive('Age must be positive'),
    phone_number: yup.string().matches(/^0\d{9}$/, 'Phone number must be 10 digits starting with 0')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
      gender: '',
      age: '',
      phone_number: ''
    },
    validationSchema,
    onSubmit: (values) => {
      fetch(`${baseUrl}/api/teachers/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      .then(res => {
        if (res.status === 201) {
          alert('Teacher account created successfully');
          formik.resetForm();
          navigate('/teacher-login');
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
          <h2 className="login-title">Teacher Signup</h2>
        
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
            <label htmlFor="gender" className="form-label">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              className="form-input"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <p className="error-message">{formik.errors.gender}</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="age" className="form-label">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formik.values.age}
              onChange={formik.handleChange}
              className="form-input"
            />
            <p className="error-message">{formik.errors.age}</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="phone_number" className="form-label">Phone Number:</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              className="form-input"
            />
            <p className="error-message">{formik.errors.phone_number}</p>
          </div>
          
          <button type="submit" className="login-button">
            Sign Up
          </button>
        </form>
        
        <button onClick={() => navigate('/teacher-login')} className="back-button">
          Back to Login
        </button>
        </div>
      </div>
    </>
  );
};

export default TeacherSignup;