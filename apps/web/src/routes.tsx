import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { useAuth } from "./auth";
import { AdminQueue } from "./pages/AdminQueue";
import { Browse } from "./pages/Browse";
import { EquipmentDetail } from "./pages/EquipmentDetail";
import { Login } from "./pages/Login";
import { MyBookings } from "./pages/MyBookings";

function ProtectedRoute() { return useAuth().user ? <Outlet /> : <Navigate replace to="/login" />; }
function AdminRoute() { return useAuth().user?.role === "admin" ? <Outlet /> : <Navigate replace to="/browse" />; }

export function AppRoutes() {
  return <Routes>
    <Route element={<Login />} path="/login" />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppShell />}>
        <Route element={<Browse />} path="/browse" />
        <Route element={<EquipmentDetail />} path="/equipment/:id" />
        <Route element={<MyBookings />} path="/bookings" />
        <Route element={<AdminRoute />}><Route element={<AdminQueue />} path="/admin" /></Route>
      </Route>
    </Route>
    <Route element={<Navigate replace to="/browse" />} path="*" />
  </Routes>;
}
