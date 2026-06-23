import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import VehicleForm from "../pages/VehicleForm";
import VehicleList from "../pages/VehicleList";
import ExpiryAlerts from "../pages/ExpiryAlerts";

import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicle-entry"
        element={
          <ProtectedRoute>
            <VehicleForm />
          </ProtectedRoute>
        }
      />

      <Route
      path="/vehicle-entry/:id"
      element={
        <ProtectedRoute>
          <VehicleForm />
        </ProtectedRoute>
      }
      />

      <Route
        path="/vehicle-list"
        element={
          <ProtectedRoute>
            <VehicleList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/expiry-alerts"
        element={
          <ProtectedRoute>
            <ExpiryAlerts />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}