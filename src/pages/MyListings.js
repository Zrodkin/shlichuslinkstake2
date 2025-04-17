import React, { useEffect, useState } from "react";

function MyListings() {
  const [listings, setListings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    jobTitle: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    volunteerGender: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/listings/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error("Failed to fetch your listings:", err);
      }
    };

    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.msg || "Delete failed");

      setListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleEditClick = (listing) => {
    setEditingId(listing._id);
    setEditFormData({
      jobTitle: listing.jobTitle,
      description: listing.description,
      location: listing.location,
      startDate: listing.startDate?.slice(0, 10) || "",
      endDate: listing.endDate?.slice(0, 10) || "",
      volunteerGender: listing.volunteerGender,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/listings/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.msg || "Update failed");

      setListings((prev) => prev.map((l) => (l._id === editingId ? data : l)));
      setEditingId(null);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">My Listings</h1>
      {listings.length === 0 ? (
        <p className="text-gray-600 text-center">You haven't posted any listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white rounded-xl p-6 shadow-md relative flex flex-col justify-between"
            >
              {editingId === listing._id ? (
                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <input
                    type="text"
                    name="jobTitle"
                    value={editFormData.jobTitle}
                    onChange={handleEditChange}
                    className="w-full border rounded p-2"
                    placeholder="Job Title"
                  />
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    className="w-full border rounded p-2"
                    placeholder="Description"
                  />
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditChange}
                    className="w-full border rounded p-2"
                    placeholder="Location"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="date"
                      name="startDate"
                      value={editFormData.startDate}
                      onChange={handleEditChange}
                      className="w-full border rounded p-2"
                    />
                    <input
                      type="date"
                      name="endDate"
                      value={editFormData.endDate}
                      onChange={handleEditChange}
                      className="w-full border rounded p-2"
                    />
                  </div>
                  <select
                    name="volunteerGender"
                    value={editFormData.volunteerGender}
                    onChange={handleEditChange}
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male Volunteers</option>
                    <option value="female">Female Volunteers</option>
                  </select>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-sm text-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="absolute top-2 right-2 flex gap-3">
                    <button
                      onClick={() => handleEditClick(listing)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>

                  {/* ✅ Show uploaded image */}
                  {listing.imageUrl && (
                    <img
                      src={`${process.env.REACT_APP_API_URL}${listing.imageUrl}`}
                      alt="Listing"
                      className="w-full h-48 object-cover rounded mb-3 mt-2"
                    />
                  )}

                  <h2 className="text-xl font-semibold">{listing.jobTitle}</h2>
                  <p className="text-gray-600 mb-2">{listing.description}</p>
                  <p className="text-sm text-gray-500">{listing.location}</p>
                  <p className="text-sm text-blue-500 mt-2">
                    For: {listing.volunteerGender} volunteers
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {listing.startDate && `Start: ${new Date(listing.startDate).toLocaleDateString()}`}<br />
                    {listing.endDate && `End: ${new Date(listing.endDate).toLocaleDateString()}`}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;