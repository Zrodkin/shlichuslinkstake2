import React, { useState } from "react";

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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/listings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submission,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.msg || "Failed to create listing");

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
