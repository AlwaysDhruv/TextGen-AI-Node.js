import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DeveloperPage from './pages/DeveloperPage';
import ChatPage from './pages/ChatPage'; // Import the new ChatPage

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/developer" element={<DeveloperPage />} />
      <Route path="/message" element={<ChatPage />} />
    </Routes>
  );
}

export default App;