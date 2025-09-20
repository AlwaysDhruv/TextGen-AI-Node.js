import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DeveloperPage from './pages/DeveloperPage';

function App() {
  return (
    // This component now ONLY handles routing
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/developers" element={<DeveloperPage />} />
    </Routes>
  );
}

export default App;