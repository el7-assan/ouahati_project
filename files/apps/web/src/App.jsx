import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import CitySelectionPage from '@/pages/CitySelectionPage.jsx';
import HomePage from '@/pages/HomePage.jsx';
import SmartWateringPage from '@/pages/SmartWateringPage.jsx';
import FinancingPage from '@/pages/FinancingPage.jsx';
import CommunityPage from '@/pages/CommunityPage.jsx';
import WaterMonitoringPage from '@/pages/WaterMonitoringPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/city-selection"
            element={
              <ProtectedRoute>
                <CitySelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/smart-watering"
            element={
              <ProtectedRoute>
                <SmartWateringPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financing"
            element={
              <ProtectedRoute>
                <FinancingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            }
          />
          {/* Kept for backward compatibility if needed */}
          <Route
            path="/water-monitoring"
            element={
              <ProtectedRoute>
                <WaterMonitoringPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;