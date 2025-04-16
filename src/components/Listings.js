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
      let url = `${process.env.REACT_APP_API_URL}/listings`;

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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/applications`, {
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
      l.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.location.toLowerCase().includes(searchTerm.toLowerCase());

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

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Volunteer Opportunities</h1>

      {/* 🔍 Filters */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center">
        <input
          type="text"
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded p-2"
        />
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">All Genders</option>
          <option value="male">Male Volunteers</option>
          <option value="female">Female Volunteers</option>
        </select>
        <input
          type="date"
          value={startFilter}
          onChange={(e) => setStartFilter(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="date"
          value={endFilter}
          onChange={(e) => setEndFilter(e.target.value)}
          className="w-full border rounded p-2"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="az">A-Z (Title)</option>
          <option value="za">Z-A (Title)</option>
        </select>
        <button
          type="button"
          onClick={handleClearFilters}
          className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 transition"
        >
          Clear Filters
        </button>
      </div>

      {/* 📊 Listings count */}
      <p className="mb-4 text-sm text-gray-700 text-center sm:text-left">
        {filteredListings.length} listing{filteredListings.length !== 1 && "s"} found
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedListings.length === 0 ? (
          <p className="text-gray-600">No listings match your filters.</p>
        ) : (
          sortedListings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-2xl p-5 shadow-md flex flex-col justify-between h-full">
              <h2 className="text-xl font-semibold">{listing.jobTitle}</h2>
              <p className="text-sm text-gray-600 mb-1">{listing.organizationName}</p>
              <p className="text-sm text-gray-600 mb-1">{listing.location}</p>
              <p className="text-gray-700 mb-2">{listing.description}</p>
              <p className="text-xs text-gray-500">
                {listing.startDate && `From: ${new Date(listing.startDate).toLocaleDateString()}`}<br />
                {listing.endDate && `To: ${new Date(listing.endDate).toLocaleDateString()}`}
              </p>
              <p className="text-xs mt-2 text-blue-600">For: {listing.volunteerGender} volunteers</p>

              {/* ✅ Apply Button */}
              {role !== "organization" && (
                appliedIds.includes(listing._id) ? (
                  <p className="text-sm text-green-600 font-semibold mt-3">Applied ✅</p>
                ) : (
                  <button
                    onClick={() => handleApply(listing._id)}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Apply
                  </button>
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Listings;
