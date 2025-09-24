import React from 'react';
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

  const handleSubmit = (values) => {
    console.log('Student login attempt:', values);
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
        
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default StudentLogin;