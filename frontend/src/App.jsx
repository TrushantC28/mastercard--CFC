import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public & General Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import LoginForm from './pages/LoginForm';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import FeedbackFormPage from './pages/FeedbackFormPage';
import FeedbackPage from './pages/FeedbackPage';
import InsightsPage from './pages/InsightsPage';
import ReportsPage from './pages/ReportsPage';

// Admin / NGO Flow Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminEventDetails from './pages/admin/AdminEventDetails';
import CreateEventPage from './pages/admin/CreateEventPage';
import AdminVolunteersPage from './pages/admin/AdminVolunteersPage';
import AdminSPOCsPage from './pages/admin/AdminSPOCsPage';
import AdminFeedbackPage from './pages/admin/AdminFeedbackPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App font-sans text-slate-800">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/:role" element={<LoginForm />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Volunteer / General Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/feedback/new" element={<FeedbackFormPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/reports" element={<ReportsPage />} />

          {/* Admin / NGO Portal Flow */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/events/new" element={<CreateEventPage />} />
          <Route path="/admin/events/:id" element={<AdminEventDetails />} />
          <Route path="/admin/volunteers" element={<AdminVolunteersPage />} />
          <Route path="/admin/spocs" element={<AdminSPOCsPage />} />
          <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
