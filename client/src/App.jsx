import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home.jsx'
import ClassteacherLogin from './ClassteacherLogin.jsx'

import StudentLogin from './StudentLogin.jsx'
import GuardianLogin from './GuardianLogin.jsx'
import StudentSignup from './StudentSignup.jsx'
import StudentDashboard from './StudentDashboard.jsx'
import GuardianSignup from './GuardianSignup.jsx'
import GuardianDashboard from './GuardianDashboard.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
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
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/guardian-login" element={<GuardianLogin />} />
        <Route path="/student-signup" element={<StudentSignup />} />
        <Route path="/student-dashboard" element={
          <ProtectedRoute userType="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/guardian-signup" element={<GuardianSignup />} />
        <Route path="/guardian-dashboard" element={
          <ProtectedRoute userType="guardian">
            <GuardianDashboard />
          </ProtectedRoute>
        } />
        <Route path="/classteacher-studentList" element={
          <ProtectedRoute userType="classteacher">
            <ClassStudentList/>
          </ProtectedRoute>
        } />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/teacher-signup" element={<TeacherSignup />} />
        <Route path="/teacher-student-list" element={
          <ProtectedRoute userType="teacher">
            <TeacherStudentList />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
