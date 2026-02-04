import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup'
import baseUrl from './api';
import './App.css';

function StudentCard({ student, setRefreshPage, refreshPage }) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
   
  function handleDelete(){
   const confirmMessage= confirm("Are you sure you want to remove this student from your class?")
   if (!confirmMessage) return
   fetch(`${baseUrl}/api/students/${student.id}`, {
    method:"DELETE",
   }).
   then(res=> {
    if (res.status===200){
      setRefreshPage(!refreshPage)
      alert('student successfully deleted')
    }
    else{
      alert('Error in deleteing student')
    }
   }).catch(error=> console.error("Error", error))
  }

  useEffect(() => {
    fetch(`${baseUrl}/api/teachers`)
      .then(res => res.json())
      .then(data => setTeachers(data))
      .catch(error => console.error('Error fetching teachers:', error));

    fetch(`${baseUrl}/api/subjects`)
      .then(res => res.json())
      .then(data => setSubjects(data))
      .catch(error => console.error('Error fetching subjects:', error));
  }, []);

  const subjectFormSchema = yup.object().shape({
    teacher_id: yup.number().required('Teacher is required'),
    subject_id: yup.number().required('Subject is required'),
  });

  const subjectFormik = useFormik({
    initialValues: { teacher_id: '', subject_id: '' },
    validationSchema: subjectFormSchema,
    onSubmit: (values) => {
      fetch(`${baseUrl}/api/student_subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          teacher_id: values.teacher_id,
          subject_id: values.subject_id
        })
      })
      .then(res => {
        if (res.status === 201) {
          alert('Subject added successfully');
          subjectFormik.resetForm();
          setShowSubjectForm(false);
          setRefreshPage(!refreshPage);
        } else {
          alert('Error adding subject');
        }
      })
      .catch(error => console.error('Error:', error));
    }
  });
  
 const formSchema = yup.object().shape({
  general_report: yup.string(),
  fee_status: yup.number()
    .oneOf([0, 1], "Fee status must be either 0 for not cleared or 1 for cleared"),
});

  const formik= useFormik({
   initialValues: {general_report:"", fee_status:""},
   validationSchema: formSchema,
   onSubmit: (values)=>{
    fetch(`${baseUrl}/api/students/${student.id}`, {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(values)
    })
    .then(res=>{
      if(res.status===200){
        alert("student successfully updated")
        formik.resetForm()
        setShowEditForm(false)
        setRefreshPage(!refreshPage)
      }
      else{
        alert("Error updating student")
      }
    }).catch(error=> console.error("Error", error))
   }
  })

  return (
    <div className="student-card">
      <div className="student-header">
        {student.image && (
          <img 
            src={student.image} 
            alt={student.name}
            className="student-image"
          />
        )}
        <div>
          <h3 className="student-name">{student.name}</h3>
          <h4 style={{fontWeight:"bold", textDecoration:"underline", marginBottom:"5px", color:"black"}}>Guardian Details</h4>
          <p className="student-guardian">
            Guardian name: {student.guardian ? student.guardian.name : 'No guardian assigned'}
          </p>
           <p className="student-guardian">
            Guardian contact: {student.guardian ? student.guardian.phone_number: 'No guardian assigned'}
          </p>
          <div className='student-buttons'>
              <button onClick={handleDelete}>Delete ✖️</button>
              <button onClick={() => setShowEditForm(!showEditForm)}>Edit report ✏️</button>
              <button onClick={() => setShowSubjectForm(!showSubjectForm)}>Add subjects +</button>
          </div>
          {showEditForm && (
            <form onSubmit={formik.handleSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="general_report" className="form-label">Enter general report:</label>
                <input
                  type="text"
                  name="general_report"
                  value={formik.values.general_report}
                  onChange={formik.handleChange}
                  className="form-input"
                />
                <p className="error-message">{formik.errors.general_report}</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="fee_status" className="form-label">Fee status:</label>
                <input
                  type="number"
                  name="fee_status"
                  value={formik.values.fee_status}
                  onChange={formik.handleChange}
                  placeholder="0 for uncleared & 1 for cleared fees"
                  className="form-input"
                />
                <p className="error-message">{formik.errors.fee_status}</p>
              </div>
              
              <button type="submit" className="submit-button">Submit</button>
            </form>
          )}
          
          {showSubjectForm && (
            <form onSubmit={subjectFormik.handleSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="teacher_id" className="form-label">Select Teacher:</label>
                <select
                  name="teacher_id"
                  value={subjectFormik.values.teacher_id}
                  onChange={subjectFormik.handleChange}
                  className="form-input"
                >
                  <option value="">Choose a teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
                <p className="error-message">{subjectFormik.errors.teacher_id}</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject_id" className="form-label">Select Subject:</label>
                <select
                  name="subject_id"
                  value={subjectFormik.values.subject_id}
                  onChange={subjectFormik.handleChange}
                  className="form-input"
                >
                  <option value="">Choose a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
                <p className="error-message">{subjectFormik.errors.subject_id}</p>
              </div>
              
              <button type="submit" className="submit-button">Add Subject</button>
            </form>
          )}
        </div>
      </div>

      <div className="student-info">
        <p>
          <strong style={{fontWeight:"bold", color:"black"}}>Fee Status:</strong> 
          <span className={student.fee_status ? 'fee-cleared' : 'fee-not-cleared'}>
            {student.fee_status ? 'Cleared' : 'Not Cleared'}
          </span>
        </p>
        
        <p>
          <strong style={{fontWeight:"bold", color:"black"}}>General Report:</strong> {student.general_report || 'No report available'}
        </p>
      </div>

      <div>
        <h4 className="subjects-title">Subjects & Grades:</h4>
        {student.student_subjects && student.student_subjects.length > 0 ? (
          <div className="subjects-grid">
            {student.student_subjects.map((ss) => (
              <div key={ss.id} className="subject-card">
                <p className="subject-name">
                  {ss.subject ? ss.subject.name : 'Unknown Subject'}
                </p>
                <p className="subject-teacher">
                  Teacher: {ss.teacher ? ss.teacher.name : 'No teacher assigned'}
                </p>
                <p className="subject-grade">
                  Grade: <span className="grade-value">{ss.grade || 'Not graded'}</span>
                </p>
              </div>
            ))}
            
          </div>
        ) : (
          <p className="no-subjects">No subjects assigned</p>
        )}
      </div>
    </div>
  );
}

export default StudentCard;