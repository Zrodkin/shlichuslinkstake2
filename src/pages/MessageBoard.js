import React, { useState, useEffect } from "react";

function MessageBoard() {
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState("");
  const [message, setMessage] = useState("");

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          setMessages([]);
          setMessage("❌ Unexpected response from server");
        }
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
        setMessage("❌ Could not load messages");
      });
  }, [API]);

  const handlePost = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) return setMessage("❌ You must be logged in to post");

      const res = await fetch(`${API}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || data.error || "Failed to post");

      setMessages([data, ...messages]);
      setNewText("");
      setMessage("✅ Message posted");
    } catch (err) {
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

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📬 Message Board</h2>

        <form
          onSubmit={handlePost}
          className="bg-white p-6 rounded-xl shadow-lg space-y-4 mb-8"
        >
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="4"
            placeholder="Share your thoughts..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          ></textarea>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{message}</span>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Post
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-blue-700 font-semibold">
                  {msg.postedBy?.email || "Anonymous"}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{msg.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MessageBoard;
