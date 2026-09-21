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
        <Link aria-label="CampusKit home" className="brand" to="/browse">
          <span aria-hidden="true" className="brand-mark">C</span>
          <span className="brand-copy"><strong>CampusKit</strong><small>Campus resources</small></span>
        </Link>
        <nav aria-label="Main navigation" className="site-nav">
          <NavLink to="/browse">Browse</NavLink>
          <NavLink to="/bookings">My bookings</NavLink>
          {user?.role === "admin" && <NavLink to="/admin">Admin queue</NavLink>}
        </nav>
        <div className="account"><span aria-hidden="true" className="account-avatar">{user?.name?.slice(0, 1)}</span><span className="account-name">{user?.name}</span><Button onClick={signOut} size="sm" variant="ghost">Sign out</Button></div>
      </header>
      <main className="page-content"><Outlet /></main>
    </div>
  );
}
