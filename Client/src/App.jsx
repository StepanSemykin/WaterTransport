<<<<<<< HEAD
import HomePage from './pages/HomePage.jsx'
import User from './pages/User'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<User />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
=======
import HomePage from './pages/Home'
import './App.css'

function App() {
  return (
    <div className="App">
      <HomePage />
    </div>
  )
}

export default App;
>>>>>>> 1724cd0d76d6c185df29096f799b283048f07944
