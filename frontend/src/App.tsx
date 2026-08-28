import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import JournalPage from './pages/JournalPage';
import EventsPage from './pages/EventsPage';
import SemesterPage from './pages/SemesterPage';
import IntelligencePage from './pages/IntelligencePage';
import WeeklyReportPage from './pages/WeeklyReportPage';
import DataTransparencyPage from './pages/DataTransparencyPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Landing page */}
                <Route path="/" element={<LandingPage />} />

                {/* Public routes (redirect to /dashboard if logged in) */}
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                </Route>

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/journal" element={<JournalPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/semester" element={<SemesterPage />} />
                  <Route path="/intelligence" element={<IntelligencePage />} />
                  <Route path="/weekly-report" element={<WeeklyReportPage />} />
                  <Route path="/data-transparency" element={<DataTransparencyPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
