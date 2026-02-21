import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import AppLayout from './layout/AppLayout';
import {
  // Analytics,
} from './pages/Placeholders';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Expenses from './pages/Expenses';
import Drivers from './pages/Drivers';
import Analytics from './pages/Analytics';
import useFleetStore from './store/fleetStore';
import AccessRestricted from './components/AccessRestricted';
import Profile from './pages/Profile';

function App() {
  const currentUser = useFleetStore((state) => state.currentUser);
  const isAuthenticated = !!currentUser;

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route
                      path="/vehicles"
                      element={['Administrator', 'Fleet Manager', 'Dispatcher', 'Safety Officer'].includes(currentUser?.role) ? <Vehicles /> : <AccessRestricted />}
                    />
                    <Route
                      path="/trips"
                      element={['Administrator', 'Fleet Manager', 'Dispatcher'].includes(currentUser?.role) ? <Trips /> : <AccessRestricted />}
                    />
                    <Route
                      path="/maintenance"
                      element={['Administrator', 'Fleet Manager', 'Safety Officer'].includes(currentUser?.role) ? <Maintenance /> : <AccessRestricted />}
                    />
                    <Route
                      path="/expenses"
                      element={['Administrator', 'Fleet Manager', 'Financial Analyst'].includes(currentUser?.role) ? <Expenses /> : <AccessRestricted />}
                    />
                    <Route
                      path="/drivers"
                      element={['Administrator', 'Safety Officer'].includes(currentUser?.role) ? <Drivers /> : <AccessRestricted />}
                    />
                    <Route
                      path="/analytics"
                      element={['Administrator', 'Financial Analyst'].includes(currentUser?.role) ? <Analytics /> : <AccessRestricted />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
