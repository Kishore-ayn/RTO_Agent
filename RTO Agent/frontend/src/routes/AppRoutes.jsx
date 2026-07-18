import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import VehicleForm from "../pages/VehicleForm";
import VehicleList from "../pages/VehicleList";
import ExpiryAlerts from "../pages/ExpiryAlerts";
import ChangePassword from "../pages/ChangePassword";
import InvoiceForm from "../pages/InvoiceForm";
import InvoiceList from "../pages/InvoiceList";
import InvoiceView from "../pages/InvoiceView";

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

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoice-entry"
        element={
          <ProtectedRoute>
            <InvoiceForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoice-entry/:id"
        element={
          <ProtectedRoute>
            <InvoiceForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoice-list"
        element={
          <ProtectedRoute>
            <InvoiceList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoice-view/:id"
        element={
          <ProtectedRoute>
            <InvoiceView />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}