import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import {
  Trips,
  Maintenance,
  Expenses,
  Drivers,
  Analytics,
} from './pages/Placeholders';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import useFleetStore from './store/fleetStore';

function App() {
  const currentUser = useFleetStore((state) => state.currentUser);
  const isAuthenticated = !!currentUser;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/vehicles" element={<Vehicles />} />
                  <Route path="/trips" element={<Trips />} />
                  <Route path="/maintenance" element={<Maintenance />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/drivers" element={<Drivers />} />
                  <Route path="/analytics" element={<Analytics />} />
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
  );
}

export default App;
