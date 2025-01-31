import React from "react";
import { Routes, Route } from "react-router";
import App from "../App";
import ChatPage from "../components/ChatPage";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/about" element={<h1>This web base page created by aakash kumar......... 
Chat Application Project 
Developed a real-time chat application with the following features and technologies: 
Frontend: Implemented using ReactJS and JavaScript for an interactive and responsive UI. Integrated particle animations for an engaging 
user experience. 
Backend: Built with Spring Boot, incorporating robust API designs and WebSocket for real-time bi-directional communication. 
Database: Utilized MongoDB for efficient storage and retrieval of chat messages and room details. 
Functionalities: 
o Users can create or join chat rooms using unique Room IDs. 
o Real-time chat powered by WebSocket. 
o API integrations for backend communication. 
This project demonstrates expertise in Java, ReactJS, Spring Boot, and MongoDB with a focus on real-time applications and 
API-driven architecture.
      </h1>} />
      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
