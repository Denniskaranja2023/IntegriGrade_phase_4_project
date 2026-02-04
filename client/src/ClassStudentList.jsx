import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentCard from './StudentCard';
import ClassTeacherNavbar from "./ClassTeacherNavbar";
import baseUrl from './api';

function ClassStudentList() {
  const[students, setStudents]= useState(null)
  const[loading, setLoading]= useState(true)
  const[refreshPage, setRefreshPage]= useState(false)
  const[error, setError]= useState(null)

  const teacherId = sessionStorage.getItem("classteacher_id")
  useEffect(()=>{
    fetch(`${baseUrl}/api/classteachers/${teacherId}/students`)
    .then(async (res)=>{
      if(res.status===200){
       const data = await res.json();
       setStudents(data)
       setLoading(false); 
      }  
      else{
       setError("Error in fetching students")
       setLoading(false);
      }
    })
  }, [refreshPage])
  
  if (loading) {
    return <div style={{color:"green"}}>Loading...</div>;
  }
  
  if (error) {
    return <div style={{color:"red"}}>{error}</div>;
  }
  
  return (
    <>
    <ClassTeacherNavbar/>
    <h1 style={{color:"#027373", marginBottom:"10px"}}> Welcome to your class</h1>
    <h2 style={{color:"#038C7F", marginBottom:"5px"}}>Students List</h2>
    <h2 style={{color:"#038C7F", marginBottom:"5px"}}>Total number of students:{students.length}</h2>
    <div className="studentlist-enclosment">
      {students && students.length > 0 ? (
        students.map(student => (
          <StudentCard key={student.id} student={student} setRefreshPage={setRefreshPage} refreshPage={refreshPage} />
        ))
      ) : (
        <p>No students found</p>
      )}
    </div>
    </>
  );
}

export default ClassStudentList;