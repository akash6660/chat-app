import React from "react";
import { Routes, Route } from "react-router-dom"; // ✅ Fixed Import
import App from "../App";
import ChatPage from "../components/ChatPage";
import AboutPage from "../components/AboutPage"; // ✅ Import AboutPage

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/about" element={<AboutPage />} /> {/* ✅ Use AboutPage */}
      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
