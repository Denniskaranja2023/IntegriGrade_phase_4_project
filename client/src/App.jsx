import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home.jsx'
import ClassteacherLogin from './ClassteacherLogin.jsx'
import ClassStudentList from './ClassStudentList.jsx'
import TeacherLogin from './TeacherLogin.jsx'
import TeacherSignup from './TeacherSignup.jsx'
import TeacherStudentList from './TeacherStudentList.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classteacher-login" element={<ClassteacherLogin />} />
        <Route path="/classteacher-studentList" element={<ClassStudentList/>} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/teacher-signup" element={<TeacherSignup />} />
        <Route path="/teacher-student-list" element={<TeacherStudentList />} />
      </Routes>
    </Router>
  )
}

export default App
