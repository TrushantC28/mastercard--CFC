import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import LoginForm from './pages/LoginForm';
import SignupPage from './pages/SignupPage';

// Volunteer / General Flow Imports
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import FeedbackFormPage from './pages/FeedbackFormPage';
import FeedbackPage from './pages/FeedbackPage';
import InsightsPage from './pages/InsightsPage';
import ReportsPage from './pages/ReportsPage';

// Admin / NGO Flow Imports
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProposalsPage from './pages/admin/AdminProposalsPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import CreateEventPage from './pages/admin/CreateEventPage';
import AdminEventDetails from './pages/admin/AdminEventDetails';
import AdminVolunteersPage from './pages/admin/AdminVolunteersPage';
import AdminSPOCsPage from './pages/admin/AdminSPOCsPage';
import AdminFeedbackPage from './pages/admin/AdminFeedbackPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

// SPOC / Corporate Partner Flow Imports
import SpocDashboard from './pages/spoc/SpocDashboard';
import SpocProposeActivityPage from './pages/spoc/SpocProposeActivityPage';
import SpocVolunteersPage from './pages/spoc/SpocVolunteersPage';
import SpocFeedbackPage from './pages/spoc/SpocFeedbackPage';

// Token Verification & Authorization Component
import ProtectedRoute from './components/common/ProtectedRoute';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App font-sans text-slate-800">
        <Routes>
          {/* Public Routes - Accessible without login */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/:role" element={<LoginForm />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Volunteer & General Portal Routes (Protected by Token Verification) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'spoc', 'corporate', 'admin']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'spoc', 'corporate', 'admin']}>
                <EventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'spoc', 'corporate', 'admin']}>
                <EventDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'spoc', 'corporate', 'admin']}>
                <FeedbackPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback/new"
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'spoc', 'corporate', 'admin']}>
                <FeedbackFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/insights"
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'spoc', 'corporate', 'admin']}>
                <InsightsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'spoc', 'corporate', 'admin']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin / NGO Portal Flow Routes (Protected - Admin Only) */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/proposals"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProposalsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events/new"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEventDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/volunteers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminVolunteersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/spocs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSPOCsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminFeedbackPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProfilePage />
              </ProtectedRoute>
            }
          />

          {/* SPOC / Corporate Partner Portal Routes (Protected - SPOC Only) */}
          <Route path="/spoc" element={<Navigate to="/spoc/dashboard" replace />} />
          <Route
            path="/spoc/dashboard"
            element={
              <ProtectedRoute allowedRoles={['spoc', 'corporate']}>
                <SpocDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/spoc/propose"
            element={
              <ProtectedRoute allowedRoles={['spoc', 'corporate']}>
                <SpocProposeActivityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/spoc/volunteers"
            element={
              <ProtectedRoute allowedRoles={['spoc', 'corporate']}>
                <SpocVolunteersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/spoc/feedback"
            element={
              <ProtectedRoute allowedRoles={['spoc', 'corporate']}>
                <SpocFeedbackPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
