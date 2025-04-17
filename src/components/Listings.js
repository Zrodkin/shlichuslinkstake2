import React, { useEffect, useState } from "react";

function Listings() {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [startFilter, setStartFilter] = useState("");
  const [endFilter, setEndFilter] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [appliedIds, setAppliedIds] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchListings = async () => {
      let url = `${process.env.REACT_APP_API_URL || "https://shlichus-backend-47a68a0c2980.herokuapp.com"}/listings`;

      if (role === "male" || role === "female") {
        url += `?volunteerGender=${role}`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error("Failed to load listings:", err);
      }
    };

    fetchListings();
  }, [role]);

  useEffect(() => {
    // Fetch user's applied listings to update the UI
    const fetchAppliedListings = async () => {
      const token = localStorage.getItem("token");
      if (!token || role === "organization") return;

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || "https://shlichus-backend-47a68a0c2980.herokuapp.com"}/applications/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const ids = data.map(app => app.listingId);
          setAppliedIds(ids);
        }
      } catch (err) {
        console.error("Failed to load applied listings:", err);
      }
    };

    fetchAppliedListings();
  }, [role]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setGenderFilter("");
    setStartFilter("");
    setEndFilter("");
    setSortOption("newest");
  };

  const handleApply = async (listingId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "https://shlichus-backend-47a68a0c2980.herokuapp.com"}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to apply");

      setAppliedIds((prev) => [...prev, listingId]);
      alert("✅ Successfully applied and message sent to the organization.");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = genderFilter === "" || l.volunteerGender === genderFilter;
    const matchesStart = !startFilter || new Date(l.startDate) >= new Date(startFilter);
    const matchesEnd = !endFilter || new Date(l.endDate) <= new Date(endFilter);

    return matchesSearch && matchesGender && matchesStart && matchesEnd;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.startDate || b.createdAt) - new Date(a.startDate || a.createdAt);
    }
    if (sortOption === "oldest") {
      return new Date(a.startDate || a.createdAt) - new Date(b.startDate || b.createdAt);
    }
    if (sortOption === "az") {
      return a.jobTitle.localeCompare(b.jobTitle);
    }
    if (sortOption === "za") {
      return b.jobTitle.localeCompare(a.jobTitle);
    }
    return 0;
  });

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Generate a color based on listing title (for consistent color per listing)
  const getColor = (str) => {
    if (!str) return "from-red-400 to-red-600";
    
    const colors = [
      "from-red-400 to-red-600",
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600",
      "from-purple-400 to-purple-600",
      "from-yellow-400 to-yellow-600",
      "from-pink-400 to-pink-600",
      "from-indigo-400 to-indigo-600",
    ];
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  console.log("Current user role:", role);

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Volunteer Opportunities</h1>

      {/* Filter section with nicer styling */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-4">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Job title, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Genders</option>
              <option value="male">Male Volunteers</option>
              <option value="female">Female Volunteers</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startFilter}
              onChange={(e) => setStartFilter(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endFilter}
              onChange={(e) => setEndFilter(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">A-Z (Title)</option>
              <option value="za">Z-A (Title)</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-200 text-sm font-medium rounded-lg hover:bg-gray-300 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Listings count */}
      <p className="mb-4 text-sm text-gray-700">
        {filteredListings.length} listing{filteredListings.length !== 1 && "s"} found
      </p>

      {/* Airbnb-style grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedListings.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-600 text-lg">No listings match your filters.</p>
            <button 
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          sortedListings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 flex flex-col h-full">
              {/* Image or gradient placeholder */}
              <div className="h-48 relative">
                {listing.imageUrl ? (
                  <img 
                    src={listing.imageUrl} 
                    alt={listing.jobTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`h-full w-full bg-gradient-to-r ${getColor(listing.jobTitle)}`}></div>
                )}
                
                <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-lg text-xs font-semibold text-red-600">
                  For {listing.volunteerGender} volunteers
                </div>
                {/* Organization name as overlay text */}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg text-sm">
                  {listing.organizationName}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                {/* Header */}
                <div className="mb-3">
                  <h2 className="text-xl font-semibold">{listing.jobTitle}</h2>
                </div>
                
                {/* Location */}
                <p className="text-sm text-gray-700 mb-3 flex items-center">
                  <span className="mr-1">📍</span> {listing.location}
                </p>
                
                {/* Description - truncated */}
                <p className="text-gray-700 mb-4 flex-grow">
                  {truncateText(listing.description, 120)}
                </p>
                
                {/* Dates */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <span className="mr-1">📅</span>
                  <span>
                    {listing.startDate && new Date(listing.startDate).toLocaleDateString()} 
                    {listing.endDate && ` - ${new Date(listing.endDate).toLocaleDateString()}`}
                  </span>
                </div>
                
                {/* Apply Button */}
                {role !== "organization" && (
                  appliedIds.includes(listing._id) ? (
                    <div className="bg-green-50 text-green-700 py-2 px-4 rounded-lg text-center font-medium">
                      Applied ✅
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(listing._id)}
                      className="w-full py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                    >
                      Apply Now
                    </button>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Listings;