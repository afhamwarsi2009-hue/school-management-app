import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { schoolLogo } from '../constants/branding.js';

export function DashboardLayout() {
  const { user } = useAuth();

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="brand-mark">
          <img src={schoolLogo} alt="Gurugram Public School logo" />
          <span>Gurugram Secure</span>
        </div>
        <nav>
          {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
          {user?.role === 'student' && <Link to="/student">Student</Link>}
          <Link to="/parent">Parent</Link>
          <Link to="/payments">Payments</Link>
        </nav>
      </aside>
      <section className="dashboard-workspace">
        <Outlet />
      </section>
    </main>
  );
}
