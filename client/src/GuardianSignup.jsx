import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './App.css';

const validationSchema = Yup.object({
  guardianName: Yup.string()
    .required('Guardian Name is required')
    .min(2, 'Name must be at least 2 characters'),
  relationship: Yup.string()
    .required('Relationship is required'),
  phoneNumber: Yup.string()
    .required('Phone Number is required')
    .min(10, 'Phone number must be at least 10 digits'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required')
});

function GuardianSignup() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    console.log('Form submitted with values:', values);
    try {
      const requestData = {
        name: values.guardianName,
        relationship: values.relationship,
        phone_number: values.phoneNumber,
        password: values.password
      };
      console.log('Sending request data:', requestData);
      
      const response = await fetch('/api/guardians/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(errorData.error || 'Signup failed');
        return;
      }

      const data = await response.json();
      console.log('Success response:', data);
      alert('Account created successfully!');
      navigate('/guardian-login');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Guardian Sign Up</h2>
        
        <Formik
          initialValues={{
            guardianName: '',
            relationship: '',
            phoneNumber: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="guardianName">Full Name:</label>
              <Field
                type="text"
                id="guardianName"
                name="guardianName"
                className="form-input"
              />
              <ErrorMessage name="guardianName" component="div" style={{color: '#027373', fontSize: '14px', marginTop: '5px'}} />
            </div>

            <div className="form-group">
              <label htmlFor="relationship">Relationship:</label>
              <Field as="select" id="relationship" name="relationship" className="form-input">
                <option value="">Select Relationship</option>
                <option value="Parent">Parent</option>
                <option value="Guardian">Guardian</option>
                <option value="Grandparent">Grandparent</option>
                <option value="Uncle/Aunt">Uncle/Aunt</option>
                <option value="Other">Other</option>
              </Field>
              <ErrorMessage name="relationship" component="div" style={{color: '#027373', fontSize: '14px', marginTop: '5px'}} />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number:</label>
              <Field
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="form-input"
              />
              <ErrorMessage name="phoneNumber" component="div" style={{color: '#027373', fontSize: '14px', marginTop: '5px'}} />
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
        
        <button onClick={() => navigate('/guardian-login')} className="back-button">
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default GuardianSignup;