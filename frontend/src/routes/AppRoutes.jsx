import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Projects from '../pages/Projects';
import ProjectDetails from '../pages/ProjectDetails';
import Contact from '../pages/Contact';
import AIAssistant from '../ai-bot/AIAssistant';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/Common/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/ai-assistant" element={<AIAssistant />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Fallback 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
