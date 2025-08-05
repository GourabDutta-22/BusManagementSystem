import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import AdminPanel from './components/Admin/AdminPanel';
import TripManagement from './components/Staff/TripManagement';
import BusStatus from './components/Staff/BusStatus';
import RouteManagement from './components/Admin/RouteManagement';
import BusManagement from './components/Admin/BusManagement';
import Reports from './components/Reports/Reports';
import Navbar from './components/Layout/Navbar';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Staff Routes */}
          <Route path="/trips" element={<TripManagement />} />
          <Route path="/bus-status" element={<BusStatus />} />
          <Route path="/reports" element={<Reports />} />
          
          {/* Admin Routes */}
          {user.role === 'admin' && (
            <>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/routes" element={<RouteManagement />} />
              <Route path="/buses" element={<BusManagement />} />
            </>
          )}
          
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;