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

import { Routes, Route, Navigate, useLocation } from "react-router-dom"

import { AuthProvider } from "./components/auth/AuthContext.jsx";
import { SearchProvider, useSearch  } from "./components/search/SearchContext";

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx"
import Auth from "./pages/Auth.jsx"
import User from "./pages/User.jsx"
import Partner from "./pages/Partner.jsx"
import Support from "./pages/Support.jsx"
import Results from "./pages/Results.jsx"
import Calendar from "./pages/AvailabilityPage.jsx"

import "./App.css"

function RequireSearch({ children }) {
  const location = useLocation();
  const { results, loading } = useSearch();
  const canOpen = sessionStorage.getItem("canOpenResults") === "1";

  if (loading) return null; // можно показать лоадер

  if (!results || !canOpen) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <div className="App">
          <Routes>
            <Route 
              path="/auth" 
              element={<Auth />} 
            />
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={["common"]}>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={["common"]}>
                  <User />
                </ProtectedRoute>
              }
            />
            <Route
              path="/partner"
              element={
                <ProtectedRoute allowedRoles={["partner"]}>
                  <Partner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <RequireSearch>
                  <Results />
                </RequireSearch>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute allowedRoles={["common"]}>
                  <Calendar />
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
            <Route 
              path="*" 
              element={
              <Navigate to="/auth" replace />} 
            />
          </Routes>
        </div>
      </SearchProvider>
    </AuthProvider>
  );
}