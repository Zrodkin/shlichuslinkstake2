import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MessageBoard from "./pages/MessageBoard";
import Listings from "./components/Listings";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import MyApplications from "./pages/MyApplications";
import Inbox from "./pages/Inbox";

// Protect routes from unauthenticated users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

// Responsive navbar with role-aware buttons and hamburger menu
const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const unread = Array.isArray(data)
          ? data.filter((msg) => msg.read === false).length
          : 0;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Failed to fetch unread messages:", err);
      }
    };

    if (token) {
      fetchUnreadCount();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header className="bg-red-500 text-white p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="flex justify-between items-center w-full sm:w-auto">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Shlichus Connect</h1>
          {role && <p className="text-sm">Role: {role}</p>}
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden text-white text-2xl"
        >
          ☰
        </button>
      </div>

      <div
        className={`mt-2 sm:mt-0 flex flex-col sm:flex-row gap-3 ${
          isMenuOpen ? "block" : "hidden sm:flex"
        }`}
      >
        <button
          onClick={() => navigate("/listings")}
          className="bg-white text-red-500 px-3 py-1 rounded hover:bg-gray-100 transition text-sm font-semibold"
        >
          Listings
        </button>

        {(role === "male" || role === "female") && (
          <button
            onClick={() => navigate("/my-applications")}
            className="bg-white text-red-500 px-3 py-1 rounded hover:bg-gray-100 transition text-sm font-semibold"
          >
            My Applications
          </button>
        )}

        {role === "organization" && (
          <>
            <button
              onClick={() => navigate("/create-listing")}
              className="bg-white text-red-500 px-3 py-1 rounded hover:bg-gray-100 transition text-sm font-semibold"
            >
              + Create Listing
            </button>
            <button
              onClick={() => navigate("/my-listings")}
              className="bg-white text-red-500 px-3 py-1 rounded hover:bg-gray-100 transition text-sm font-semibold"
            >
              My Listings
            </button>
          </>
        )}

        <button
          onClick={() => navigate("/inbox")}
          className="relative bg-white text-red-500 px-3 py-1 rounded hover:bg-gray-100 transition text-sm font-semibold"
        >
          Inbox
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
              {unreadCount}
            </span>
          )}
        </button>

        {token && (
          <button
            onClick={handleLogout}
            className="bg-white text-red-500 px-3 py-1 rounded hover:bg-gray-100 transition text-sm font-semibold"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

function App() {
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <MessageBoard role={role} />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings"
          element={
            <>
              <Header />
              <Listings role={role} />
            </>
          }
        />
        <Route
          path="/create-listing"
          element={
            role === "organization" ? (
              <>
                <Header />
                <CreateListing />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/my-listings"
          element={
            role === "organization" ? (
              <>
                <Header />
                <MyListings />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/my-applications"
          element={
            role === "male" || role === "female" ? (
              <>
                <Header />
                <MyApplications />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <Inbox />
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
