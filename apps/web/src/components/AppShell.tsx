import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@campuskit/ui";
import { useAuth } from "../auth";

export function AppShell() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  function signOut() { logout(); navigate("/login"); }
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/browse">CampusKit</Link>
        <nav aria-label="Main navigation" className="site-nav">
          <NavLink to="/browse">Browse</NavLink>
          <NavLink to="/bookings">My bookings</NavLink>
          {user?.role === "admin" && <NavLink to="/admin">Admin queue</NavLink>}
        </nav>
        <div className="account"><span>{user?.name}</span><Button onClick={signOut} size="sm" variant="ghost">Sign out</Button></div>
      </header>
      <main className="page-content"><Outlet /></main>
    </div>
  );
}
