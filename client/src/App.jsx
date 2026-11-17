import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './layouts/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PeriodCalendarPage } from './pages/PeriodCalendarPage';
import { PeriodHistoryPage } from './pages/PeriodHistoryPage';
import { MoodTrackerPage } from './pages/MoodTrackerPage';
import { MoodHistoryPage } from './pages/MoodHistoryPage';
import { SymptomTrackerPage } from './pages/SymptomTrackerPage';
import { FertilityCalendarPage } from './pages/FertilityCalendarPage';
import { CycleInsightsPage } from './pages/CycleInsightsPage';
import { PersonalInsightsPage } from './pages/PersonalInsightsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF4E9] flex items-center justify-center text-[#171316]">
        <div className="text-center space-y-3">
          <span className="text-5xl font-logo text-[#C51F46] animate-pulse block">blush.</span>
          <p className="text-xs font-bold uppercase tracking-wider text-[#171316]/70">
            Opening Ananya's world... ♡
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Onboarding Route */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated Application Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/calendar" element={<PeriodCalendarPage />} />
            <Route path="/history" element={<PeriodHistoryPage />} />
            <Route path="/moods" element={<MoodTrackerPage />} />
            <Route path="/moods/history" element={<MoodHistoryPage />} />
            <Route path="/symptoms" element={<SymptomTrackerPage />} />
            <Route path="/fertility" element={<FertilityCalendarPage />} />
            <Route path="/insights" element={<CycleInsightsPage />} />
            <Route path="/insights/personal" element={<PersonalInsightsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
