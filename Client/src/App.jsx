import { Routes, Route, Navigate } from "react-router-dom"

import HomePage from "./pages/HomePage.jsx"
import Auth from "./pages/Auth.jsx"
import User from "./pages/User"
import Partner from "./pages/Partner.jsx"
import Support from "./pages/Support.jsx"

import "./App.css"

export default function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/user" element={<User />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
    </div>
  )
}

