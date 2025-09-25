import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './App.css';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Student Name is required')
    .min(2, 'Name must be at least 2 characters'),
  guardian_id: Yup.string()
    .required('Guardian is required'),
  classteacher_id: Yup.string()
    .required('Class Teacher is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required')
});

function StudentSignup() {
  const navigate = useNavigate();
  const [classteachers, setClassteachers] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [classteachersRes, guardiansRes] = await Promise.all([
        fetch('/api/classteachers'),
        fetch('/api/guardians')
      ]);

      if (classteachersRes.ok && guardiansRes.ok) {
        const classteachersData = await classteachersRes.json();
        const guardiansData = await guardiansRes.json();
        setClassteachers(classteachersData);
        setGuardians(guardiansData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching options:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('/api/students/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          guardian_id: parseInt(values.guardian_id),
          classteacher_id: parseInt(values.classteacher_id),
          image: values.image,
          password: values.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Signup failed');
        return;
      }

      const data = await response.json();
      alert('Account created successfully!');
      navigate('/student-login');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="login-container">
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Student Sign Up</h2>
        
        <Formik
          initialValues={{
            name: '',
            guardian_id: '',
            classteacher_id: '',
            image: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="studentName">Full Name:</label>
              <Field
                type="text"
                id="name"
                name="name"
                className="form-input"
              />
              <ErrorMessage name="name" component="div" style={{color: '#027373', fontSize: '14px', marginTop: '5px'}} />
            </div>

            <div className="form-group">
              <label htmlFor="guardian_id">Select Guardian:</label>
              <Field as="select" id="guardian_id" name="guardian_id" className="form-input">
                <option value="">Choose a Guardian</option>
                {guardians.map(guardian => (
                  <option key={guardian.id} value={guardian.id}>
                    {guardian.name} ({guardian.relationship})
                  </option>
                ))}
              </Field>
              <ErrorMessage name="guardian_id" component="div" style={{color: '#027373', fontSize: '14px', marginTop: '5px'}} />
            </div>

            <div className="form-group">
              <label htmlFor="classteacher_id">Select Class Teacher:</label>
              <Field as="select" id="classteacher_id" name="classteacher_id" className="form-input">
                <option value="">Choose a Class Teacher</option>
                {classteachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="classteacher_id" component="div" style={{color: '#027373', fontSize: '14px', marginTop: '5px'}} />
            </div>

            <div className="form-group">
              <label htmlFor="image">Profile Image:</label>
              <Field
                type="text"
                id="image"
                name="image"
                className="form-input"
              />
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
              />
              <ErrorMessage name="confirmPassword" component="div" style={{color: '#027373', fontSize: '14px', marginTop: '5px'}} />
            </div>
            
            <button type="submit" className="login-button">
              Sign Up
            </button>
          </Form>
        </Formik>
        
        <button onClick={() => navigate('/student-login')} className="back-button">
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default StudentSignup;