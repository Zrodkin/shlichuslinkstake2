import React, { useEffect, useState } from "react";

function OrganizationDashboard() {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/applications/received`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("Failed to load applications:", err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="p-6 sm:p-8 bg-gray-100 min-h-screen max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📥 Received Applications</h1>

      {applications.length === 0 ? (
        <p className="text-gray-600">No applications received yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-xl shadow p-4">
              <p className="text-lg">
                <span className="font-semibold">Listing:</span> {app.listing?.jobTitle}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">From:</span> {app.user?.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Applied on: {new Date(app.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrganizationDashboard;
