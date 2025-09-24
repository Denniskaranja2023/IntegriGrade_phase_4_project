import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home.jsx'
import ClassteacherLogin from './ClassteacherLogin.jsx'
import ClassStudentList from './ClassStudentList.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classteacher-login" element={<ClassteacherLogin />} />
        <Route path="/classteacher-studentList" element={<ClassStudentList/>} />
      </Routes>
    </Router>
  )
}

export default App
