import React, { useEffect, useState } from "react";

function Inbox() {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/messages/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to mark as read");

      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, read: true } : msg))
      );
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete message");

      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📨 Inbox</h1>
      {messages.length === 0 ? (
        <p className="text-gray-600">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`bg-white p-4 rounded-xl shadow border-l-4 ${
                msg.read ? "border-gray-300" : "border-blue-500"
              }`}
            >
              <p className="font-semibold text-blue-600">
                From: {msg.from?.email || "Unknown"} — related to:{" "}
                {msg.listing?.jobTitle || "Listing"}
              </p>
              <p className="mt-2">{msg.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
              <div className="mt-3 flex gap-3">
                {!msg.read && (
                  <button
                    onClick={() => handleMarkAsRead(msg._id)}
                    className="text-sm text-blue-500 underline"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="text-sm text-red-500 underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Inbox;
