import { Routes, Route, Navigate, useLocation } from "react-router-dom"

import { AuthProvider } from "./components/auth/AuthContext.jsx";
import { SearchProvider, useSearch  } from "./components/search/SearchContext";

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx"
import Auth from "./pages/Auth.jsx"
import User from "./pages/User.jsx"
import Partner from "./pages/Partner.jsx"
import Support from "./pages/Support.jsx"
import OfferResult from "./pages/OfferResult.jsx";

import "./App.css"

function RequireSearch({ children }) {
  const location = useLocation();
  const { results, loading } = useSearch();
  const canOpen = sessionStorage.getItem("canOpenResults") === "1";

  if (loading) return null;

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
                  <Home />
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
                  <OfferResult />
                </RequireSearch>
              }
            />
            {/* <Route
              path="/calendar"
              element={
                <ProtectedRoute allowedRoles={["common"]}>
                  <Calendar />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="/offerresults"
              element={
                <ProtectedRoute allowedRoles={["common"]}>
                  <OfferResult />
                </ProtectedRoute>
              }
            /> */}
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