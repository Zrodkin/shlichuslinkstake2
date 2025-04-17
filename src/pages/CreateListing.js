import React, { useState, useEffect } from "react";

function CreateListing() {
  const [formData, setFormData] = useState({
    organizationName: "",
    jobTitle: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    volunteerGender: "",
  });
  const [image, setImage] = useState(null); // ✅ image file
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log("Current token:", token ? token.substring(0, 15) + "..." : "No token");
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    const submission = new FormData();
    for (const key in formData) {
      submission.append(key, formData[key]);
    }
    if (image) {
      submission.append("image", image);
    }
  
    try {
      // Define a consistent API URL with fallback
      const API_URL = process.env.REACT_APP_API_URL || "https://shlichus-backend-47a68a0c2980.herokuapp.com";
      console.log("Submitting to:", `${API_URL}/api/listings`);
      
      // When using FormData, we can't set Content-Type header
      // But we need to include the auth token
      const response = await fetch(`${API_URL}/api/listings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: submission,
      });
  
      // Check status before trying to parse JSON
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.msg || `Server error: ${response.status}`);
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }
  
      const data = await response.json();
      setMessage("✅ Listing created successfully!");
      setFormData({
        organizationName: "",
        jobTitle: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
        volunteerGender: "",
      });
      setImage(null);
    } catch (err) {
      console.error("Create listing error:", err);
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700">
        Post a New Listing
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
        <input
          name="organizationName"
          placeholder="Organization Name"
          className="w-full border rounded p-3"
          value={formData.organizationName}
          onChange={handleChange}
          required
        />
        <input
          name="jobTitle"
          placeholder="Job Title"
          className="w-full border rounded p-3"
          value={formData.jobTitle}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          className="w-full border rounded p-3"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          className="w-full border rounded p-3"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="date"
            name="startDate"
            className="w-full border rounded p-3"
            value={formData.startDate}
            onChange={handleChange}
          />
          <input
            type="date"
            name="endDate"
            className="w-full border rounded p-3"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>
        <select
          name="volunteerGender"
          className="w-full border rounded p-3"
          value={formData.volunteerGender}
          onChange={handleChange}
          required
        >
          <option value="">Select Volunteer Gender</option>
          <option value="male">Male Volunteers</option>
          <option value="female">Female Volunteers</option>
        </select>

        {/* ✅ Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border border-gray-300 rounded-md p-3"
        />

        {/* ✅ Preview */}
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="mt-2 max-h-40 object-cover rounded"
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-semibold"
        >
          Create Listing
        </button>
        {message && <p className="text-center text-sm mt-4">{message}</p>}
      </form>
    </div>
  );
}

export default CreateListing;