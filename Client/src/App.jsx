// import { Routes, Route, Navigate } from "react-router-dom"

// import HomePage from "./pages/HomePage.jsx"
// import Auth from "./pages/Auth.jsx"
// import User from "./pages/User"
// import Partner from "./pages/Partner.jsx"
// import Support from "./pages/Support.jsx"

// import "./App.css"

// export default function App() {
//   return (
//     <div className="App">

//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/auth" element={<Auth />} />
//         <Route path="/user" element={<User />} />
//         <Route path="/partner" element={<Partner />} />
//         <Route path="/support" element={<Support />} />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
      
//     </div>
//   )
// }

import { Routes, Route, Navigate } from "react-router-dom"

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import { AuthProvider } from "./components/auth/AuthContext.jsx";

import HomePage from "./pages/HomePage.jsx"
import Auth from "./pages/Auth.jsx"
import User from "./pages/User.jsx"
import Partner from "./pages/Partner.jsx"
import Support from "./pages/Support.jsx"

import "./App.css"

export default function App() {
  return (
    <AuthProvider>

      <div className="App">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner"
            element={
              <ProtectedRoute>
                <Partner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
      
    </AuthProvider>
  );
}