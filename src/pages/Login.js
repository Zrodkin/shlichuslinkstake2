import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    try {
      // Define API URL with fallback
      const API_URL = process.env.REACT_APP_API_URL || "https://shlichus-backend-47a68a0c2980.herokuapp.com";
      console.log("Using API URL:", API_URL);
      
      // First, log in to get the token
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Check if the response is valid JSON
      let data;
      try {
        data = await loginResponse.json();
      } catch (error) {
        console.error("Failed to parse login response as JSON:", error);
        const rawText = await loginResponse.text();
        console.log("Raw response:", rawText);
        throw new Error("Login API returned invalid JSON");
      }

      if (!loginResponse.ok) {
        throw new Error(data.msg || data.error || "Login failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      console.log("Token stored successfully:", data.token);
      
      // Here's the important part - we'll try several possible endpoints
      // for getting user information
      
      // First, check if user data was already included in the login response
      if (data.user && data.user.role) {
        localStorage.setItem("role", data.user.role);
        console.log("User role found in login response:", data.user.role);
        setMessage("✅ Login successful");
        window.location.href = "/";
        return;
      }
      
      // If not, try several possible API endpoints
      const possibleEndpoints = [
        "/auth/me",
        "/users/me",
        "/api/auth/me",
        "/api/users/current",
        "/user"
      ];
      
      let userData = null;
      let successEndpoint = null;
      
      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying endpoint: ${API_URL}${endpoint}`);
          const userResponse = await fetch(`${API_URL}${endpoint}`, {
            headers: { 
              "Authorization": `Bearer ${data.token}` 
            }
          });
          
          if (userResponse.ok) {
            userData = await userResponse.json();
            successEndpoint = endpoint;
            break;
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err);
          // Continue to the next endpoint
        }
      }
      
      if (userData && userData.role) {
        // Store the user's role in localStorage
        localStorage.setItem("role", userData.role);
        console.log(`User role set to ${userData.role} from endpoint ${successEndpoint}`);
        setMessage("✅ Login successful");
        window.location.href = "/";
      } else {
        // If we still don't have the role, use a default role based on the email
        // This is a temporary fallback
        const defaultRole = email.includes("org") ? "organization" : "volunteer";
        localStorage.setItem("role", defaultRole);
        console.log(`No role found in API. Using fallback role: ${defaultRole}`);
        setMessage("✅ Login successful (using default role)");
        window.location.href = "/";
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