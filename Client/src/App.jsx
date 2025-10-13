import { Routes, Route, Navigate } from "react-router-dom"

import HomePage from "./pages/HomePage.jsx"
import User from "./pages/User.jsx"
// import Partner from "./pages/Partner.jsx"

import "./App.css"

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<User />} />
        {/* <Route path="/partner" element={<Partner />} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

