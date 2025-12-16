import { Routes, Route, Navigate} from "react-router-dom"

import { AuthProvider } from "./components/auth/AuthContext.jsx";
import { SearchProvider } from "./components/search/SearchContext";

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx"
import Auth from "./pages/Auth.jsx"
import User from "./pages/User.jsx"
import Partner from "./pages/Partner.jsx"
import Support from "./pages/Support.jsx"
import OfferResult from "./pages/OfferResult.jsx";

import "./App.css"

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
                <ProtectedRoute allowedRoles={["common"]}>
                  <OfferResult />
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