import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    console.log("Login attempt with:", email);

    try {
      // Define API URL with fallback
      const API_URL = process.env.REACT_APP_API_URL || "https://shlichus-backend-47a68a0c2980.herokuapp.com";
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || data.error || "Login failed");

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      console.log("Token stored successfully");
      
      // Now fetch the user details to get their role
      const userResponse = await fetch(`${API_URL}/auth/me`, {
        headers: { 
          "Authorization": `Bearer ${data.token}` 
        }
      });
      
      const userData = await userResponse.json();
      console.log("User data retrieved:", userData);
      
      if (userResponse.ok && userData.role) {
        // Store the user's role in localStorage
        localStorage.setItem("role", userData.role);
        console.log("User role set to:", userData.role);
        setMessage("✅ Login successful");
        
        // Add redirect to home page after successful login
        window.location.href = "/";
      } else {
        console.error("Failed to get valid user role:", userData);
        throw new Error("Failed to get user role");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <span className="text-xl font-bold text-blue-600">Shlichus Connect</span>
        <div className="space-x-4 text-sm">
          <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
          <a href="/login" className="text-gray-600 hover:text-blue-600">Login</a>
          <a href="/signup" className="text-gray-600 hover:text-blue-600">Signup</a>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Login to Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold"
            >
              Log In
            </button>
          </form>
          <p className="text-sm text-center text-gray-500 mt-4">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default Login;