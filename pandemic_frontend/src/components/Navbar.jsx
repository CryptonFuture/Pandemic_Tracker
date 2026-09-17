
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  BarChart3,
  FileClock,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  ShieldCheck,
  UserRound,
  X,
  ClipboardPlus,
} from 'lucide-react';
import "../css/Navbar.css"

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (p) =>
    location.pathname === p ? 'active' : '';

  const handleNavigation = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/map',
      label: 'Live Map',
      icon: Map,
    },
    {
      path: '/areas',
      label: 'Areas',
      icon: BarChart3,
    },
    {
      path: '/history',
      label: 'History',
      icon: FileClock,
    },
  ];

  return (
    <nav className="premium-navbar">
      <div className="container premium-navbar-container">

        {/* Brand */}
        <Link
          to="/"
          className="premium-navbar-brand"
          onClick={handleNavigation}
        >
          <div className="premium-brand-icon">
            <Activity size={20} strokeWidth={2.5} />
          </div>

          <div className="premium-brand-text">
            <span className="premium-brand-name">
              Pandemic
            </span>
            <span className="premium-brand-subtitle">
              TRACKER
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="premium-navbar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`premium-nav-link ${isActive(
                    item.path
                  )}`}
                >
                  <Icon size={16} strokeWidth={2.2} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}

          {(user?.role === 'admin' ||
            user?.role === 'health_worker') && (
            <li>
              <Link
                to="/report"
                className={`premium-nav-link premium-report-link ${isActive(
                  '/report'
                )}`}
              >
                <ClipboardPlus
                  size={16}
                  strokeWidth={2.2}
                />
                <span>Report Cases</span>
              </Link>
            </li>
          )}
        </ul>

        {/* Right Side */}
        <div className="premium-navbar-actions">

          {/* User */}
          <div className="premium-user">
            <div className="premium-user-avatar">
              <UserRound size={17} />
            </div>

            <div className="premium-user-info">
              <strong>{user?.name || 'User'}</strong>
              <span>
                {user?.role?.replace('_', ' ') || 'Viewer'}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            className="premium-logout"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="premium-mobile-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={`premium-mobile-menu ${
            menuOpen ? 'open' : ''
          }`}
        >
          <div className="premium-mobile-menu-inner">

            {/* Mobile User */}
            <div className="premium-mobile-user">
              <div className="premium-user-avatar">
                <UserRound size={18} />
              </div>

              <div>
                <strong>
                  {user?.name || 'User'}
                </strong>

                <span>
                  {user?.role?.replace('_', ' ') ||
                    'Viewer'}
                </span>
              </div>

              <div className="premium-mobile-status">
                <span />
                Active
              </div>
            </div>

            {/* Mobile Links */}
            <div className="premium-mobile-links">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleNavigation}
                    className={`premium-mobile-link ${isActive(
                      item.path
                    )}`}
                  >
                    <span className="premium-mobile-link-icon">
                      <Icon size={17} />
                    </span>

                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {(user?.role === 'admin' ||
                user?.role === 'health_worker') && (
                <Link
                  to="/report"
                  onClick={handleNavigation}
                  className={`premium-mobile-link ${isActive(
                    '/report'
                  )}`}
                >
                  <span className="premium-mobile-link-icon">
                    <ClipboardPlus size={17} />
                  </span>

                  <span>Report Cases</span>
                </Link>
              )}
            </div>

            {/* Mobile Logout */}
            <button
              type="button"
              className="premium-mobile-logout"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
