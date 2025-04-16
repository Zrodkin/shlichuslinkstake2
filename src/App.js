import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MessageBoard from "./pages/MessageBoard";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-red-500 text-white p-4 text-xl font-bold">
        TEST123 — Navbar placeholder
      </div>
      <Routes>
        <Route path="/" element={<MessageBoard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
