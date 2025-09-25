import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useFormik} from 'formik'
import * as yup from "yup"
import './App.css';

function ClassteacherLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const formSchema= yup.object().shape({
 name: yup.string().required("Name must be entered"),
 password: yup.string().required("Password must be entered")
})

const formik= useFormik({
  initialValues: {name:"", password:""},
  validationSchema: formSchema,
  onSubmit:(values)=>{
    setLoading(true);
    setError('');
   fetch("/api/classteachers/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(values),
  credentials: "include" // makes sure cookies (session) are stored too
  })
  .then(async (res) => {
    if (res.ok) {
      const data = await res.json();

      // store in localStorage
      sessionStorage.setItem("classteacher_id", data.id);
      // navigate after login
      navigate("/classteacher-studentList");
    } else {
      const data = await res.json();
      throw new Error(data.error || "Login failed");
    }
  })
  .catch((err) => {
    setError(err.message);
  })
  .finally(() => {
    setLoading(false);
  });
  }
})

  return (
    <div className="login-container" style={{padding: '20px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div className="login-form" style={{background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', minWidth: '300px'}}>
        <h2 className="login-title">Classteacher Login</h2>
        
        {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className="form-input"
            />
            <p style={{color:"red"}}>{formik.errors.name}</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              className="form-input"
            />
            <p style={{color:"red"}}>{formik.errors.password}</p>
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ClassteacherLogin;