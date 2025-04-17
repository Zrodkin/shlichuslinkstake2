import React, { useEffect, useState } from "react";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/applications/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">My Applications</h1>
      {applications.length === 0 ? (
        <p className="text-gray-600 text-center sm:text-left">You haven't applied to any listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-5 rounded-xl shadow-md flex flex-col h-full">
              {app.listing?.imageUrl && (
                <img
                  src={`${process.env.REACT_APP_API_URL}${app.listing.imageUrl}`}
                  alt="Listing"
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h2 className="text-xl font-semibold">{app.listing?.jobTitle}</h2>
              <p className="text-sm text-gray-600">{app.listing?.organizationName}</p>
              <p className="text-xs text-gray-500 mt-1">
                Applied on {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;