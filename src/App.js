import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MessageBoard from "./pages/MessageBoard";

// Protect routes from unauthenticated users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

// Responsive navbar with logout
const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-red-500 text-white p-4 flex justify-between items-center flex-wrap">
      <h1 className="text-lg sm:text-xl font-bold">Message Board</h1>
      {token && (
        <button
          onClick={handleLogout}
          className="mt-2 sm:mt-0 bg-white text-red-500 font-semibold px-3 py-1 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      )}
    </header>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <MessageBoard />
              </>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
