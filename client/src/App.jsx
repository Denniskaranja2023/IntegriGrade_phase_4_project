import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home.jsx'
import ClassteacherLogin from './ClassteacherLogin.jsx'
import StudentLogin from './StudentLogin.jsx'
import GuardianLogin from './GuardianLogin.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classteacher-login" element={<ClassteacherLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/guardian-login" element={<GuardianLogin />} />
      </Routes>
    </Router>
  )
}

export default App
