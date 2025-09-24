import React from 'react';

function StudentCard({ student, setRefreshPage, refreshPage }) {

  function handleDelete(event){
   const confirmMessage= confirm("Are you sure you want to remove this student from your class?")
   if (!confirmMessage) return
   fetch(`/api/students/${student.id}`, {
    method:"DELETE",
   }).
   then(res=> {
    if (res.status===200){
      alert('student successfully deleted')
      setRefreshPage(!refreshPage)
    }
    else{
      alert('Error in deleteing student')
    }
   }).catch(error=> console.error("Error", error))
  }

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
          <h4 style={{fontWeight:"bold", textDecoration:"underline", marginBottom:"5px"}}>Guardian Details</h4>
          <p className="student-guardian">
            Guardian name: {student.guardian ? student.guardian.name : 'No guardian assigned'}
          </p>
           <p className="student-guardian">
            Guardian contact: {student.guardian ? student.guardian.phone_number: 'No guardian assigned'}
          </p>
          <div className='student-buttons'>
              <button onClick={(event)=>handleDelete(event)}>Delete ✖️</button>
              <button >Edit report ✏️</button>
              <button >Add subjects +</button>
            </div>
        </div>
      </div>

      <div className="student-info">
        <p>
          <strong>Fee Status:</strong> 
          <span className={student.fee_status ? 'fee-cleared' : 'fee-not-cleared'}>
            {student.fee_status ? 'Cleared' : 'Not Cleared'}
          </span>
        </p>
        
        <p>
          <strong>General Report:</strong> {student.general_report || 'No report available'}
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