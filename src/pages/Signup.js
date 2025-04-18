import React, { useState } from "react";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  
  // Organization specific fields
  const [whatsappNumber, setWhatsappNumber] = useState("");
  
  // Volunteer specific fields
  const [phoneNumber, setPhoneNumber] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [referencePhone, setReferencePhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    // Password validation
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      // Create the base request body
      const requestBody = { 
        email, 
        password, 
        name,
        role 
      };
      
      // Add role-specific fields
      if (role === "organization") {
        requestBody.whatsappNumber = whatsappNumber;
      } else if (role === "male" || role === "female") {
        requestBody.phoneNumber = phoneNumber;
        requestBody.referenceName = referenceName;
        requestBody.referencePhone = referencePhone;
      }

      // Use hardcoded URL as fallback if environment variable isn't set
      const apiUrl = process.env.REACT_APP_API_URL || "https://shlichus-backend-47a68a0c2980.herokuapp.com";
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || data.error || "Signup failed");

      setMessage("✅ Signup successful. You can now log in.");
      
      // Optionally redirect to login after successful signup
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      
    } catch (err) {
      console.error("Signup error:", err);
      setMessage(`❌ ${err.message}`);
    }
  };

  // Render organization form fields
  const renderOrganizationFields = () => {
    if (role !== "organization") return null;
    
    return (
      <div className="space-y-4">
        <div className="relative">
          <input
            type="tel"
            placeholder="WhatsApp Number (with country code)"
            className="w-full border border-gray-300 rounded-md p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            required
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M11.5 0C5.149 0 0 5.148 0 11.5 0 13.394.474 15.227 1.33 16.852L.072 22.463l5.725-1.207c1.579.794 3.352 1.243 5.223 1.243 6.351 0 11.5-5.149 11.5-11.5C22.5 5.148 17.851 0 11.5 0zm0 21c-1.739 0-3.414-.413-4.92-1.193l-.353-.155-3.655.96.968-3.593-.17-.364C2.561 15.035 2 13.322 2 11.5 2 6.262 6.262 2 11.5 2S21 6.262 21 11.5 16.738 21 11.5 21z"/>
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Include your country code (e.g., +1 for US/Canada)
        </p>
      </div>
    );
  };

  // Render volunteer form fields
  const renderVolunteerFields = () => {
    if (role !== "male" && role !== "female") return null;
    
    return (
      <div className="space-y-4">
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Reference Name"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={referenceName}
          onChange={(e) => setReferenceName(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Reference Phone Number"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={referencePhone}
          onChange={(e) => setReferencePhone(e.target.value)}
          required
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <span className="text-xl font-bold text-blue-600">Shlichus Connect</span>
        <div className="space-x-4 text-sm">
          <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
          <a href="/login" className="text-gray-600 hover:text-blue-600">Login</a>
          <a href="/signup" className="text-gray-600 hover:text-blue-600">Signup</a>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Create an Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common fields for all users */}
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            
            {/* Role selection */}
            <select
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="organization">Organization (Post listings)</option>
              <option value="male">Male Volunteer</option>
              <option value="female">Female Volunteer</option>
            </select>
            
            {/* Role-specific fields */}
            {renderOrganizationFields()}
            {renderVolunteerFields()}
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold"
            >
              Sign Up
            </button>
          </form>
          <p className="text-sm text-center text-gray-500 mt-4">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default Signup;