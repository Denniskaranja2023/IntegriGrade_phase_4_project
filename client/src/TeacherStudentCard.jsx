import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import './App.css';

const TeacherStudentCard = ({ student, teacherId, setRefreshPage, refreshPage }) => {
  const [showGradeForm, setShowGradeForm] = useState(false);

  const gradeSchema = yup.object().shape({
    grade: yup.string().required('Grade is required')
  });

  const formik = useFormik({
    initialValues: { grade: student.grade || '' },
    validationSchema: gradeSchema,
    onSubmit: (values) => {
      fetch(`/api/teachers/${teacherId}/students/${student.id}/grade`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      .then(res => {
        if (res.status === 200) {
          alert('Grade updated successfully');
          setShowGradeForm(false);
          setRefreshPage(!refreshPage);
        } else {
          alert('Error updating grade');
        }
      })
      .catch(error => console.error('Error:', error));
    }
  });

  return (
    <div className="teacher-student-card">
      <div className="student-image-container">
        {student.image ? (
          <img src={student.image} alt={student.name} className="teacher-student-image" />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>
      
      <div className="teacher-student-info">
        <h3 className="teacher-student-name">{student.name}</h3>
        <p className="teacher-student-subject">Subject: {student.subject?.name || 'No subject'}</p>
        <p className="teacher-student-grade">Grade: {student.grade || 'Not graded'}</p>
        
        <button 
          className="change-grade-button" 
          onClick={() => setShowGradeForm(!showGradeForm)}
        >
          Change Grade
        </button>
        
        {showGradeForm && (
          <form onSubmit={formik.handleSubmit} className="grade-form">
            <div className="form-group">
              <input
                type="text"
                name="grade"
                value={formik.values.grade}
                onChange={formik.handleChange}
                placeholder="Enter grade"
                className="grade-input"
              />
              <p className="error-message">{formik.errors.grade}</p>
            </div>
            <button type="submit" className="submit-grade-button">Update</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeacherStudentCard;