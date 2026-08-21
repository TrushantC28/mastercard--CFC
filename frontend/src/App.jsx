import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import LoginForm from './pages/LoginForm';
import SignupPage from './pages/SignupPage';

import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import FeedbackPage from './pages/FeedbackPage';
import FeedbackFormPage from './pages/FeedbackFormPage';
import ProfilePage from './pages/ProfilePage';
import InsightsPage from './pages/InsightsPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/:role" element={<LoginForm />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Authenticated Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/feedback/new" element={<FeedbackFormPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>

          {/* Fallback for any unknown route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
