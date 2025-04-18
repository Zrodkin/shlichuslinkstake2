import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    whatsappNumber: "",
    phoneNumber: "",
    referenceName: "",
    referencePhone: ""
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  const API_URL = process.env.REACT_APP_API_URL || "https://shlichus-backend-47a68a0c2980.herokuapp.com";
  const role = localStorage.getItem("role");
  
  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }
        
        const userData = await res.json();
        
        setFormData({
          name: userData.name || "",
          whatsappNumber: userData.whatsappNumber || "",
          phoneNumber: userData.phoneNumber || "",
          referenceName: userData.referenceName || "",
          referencePhone: userData.referencePhone || ""
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setMessage("Error loading profile data. Please try again.");
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [API_URL, navigate]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        throw new Error("Failed to update profile");
      }
      
      setMessage("Profile updated successfully!");
      setLoading(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Error updating profile. Please try again.");
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Loading profile...</h1>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Edit Your Profile</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded-md ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {role === "organization" && (
          <div className="mb-4">
            <label htmlFor="whatsappNumber" className="block text-gray-700 font-medium mb-2">WhatsApp Number</label>
            <input
              type="text"
              id="whatsappNumber"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. +1234567890"
            />
            <p className="text-sm text-gray-500 mt-1">Please include country code (e.g. +1 for USA)</p>
          </div>
        )}
        
        {(role === "male" || role === "female") && (
          <>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your phone number"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="referenceName" className="block text-gray-700 font-medium mb-2">Reference Name</label>
              <input
                type="text"
                id="referenceName"
                name="referenceName"
                value={formData.referenceName}
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Name of your reference"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="referencePhone" className="block text-gray-700 font-medium mb-2">Reference Phone</label>
              <input
                type="text"
                id="referencePhone"
                name="referencePhone"
                value={formData.referencePhone}
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone number of your reference"
              />
            </div>
          </>
        )}
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default Profile;