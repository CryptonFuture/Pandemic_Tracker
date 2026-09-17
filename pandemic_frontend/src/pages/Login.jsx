
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Activity,
  MapPin,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import "../css/Login.css"

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page premium-auth-page">
      {/* Background Decoration */}
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />

      <div className="premium-auth-wrapper">

        {/* Left Branding Panel */}
        <div className="auth-brand-panel">
          <div className="brand-content">

            <div className="brand-icon">
              <Activity size={28} strokeWidth={2.4} />
            </div>

            <div className="brand-badge">
              <span className="status-dot" />
              Live Monitoring Platform
            </div>

            <h1>
              Pandemic
              <span> Tracker</span>
            </h1>

            <p className="brand-description">
              Monitor pandemic activity across countries, cities and
              local areas through one centralized platform.
            </p>

            <div className="brand-features">
              <div className="brand-feature">
                <div className="feature-icon">
                  <MapPin size={18} />
                </div>
                <div>
                  <strong>Location Intelligence</strong>
                  <span>Country, city & area monitoring</span>
                </div>
              </div>

              <div className="brand-feature">
                <div className="feature-icon">
                  <Activity size={18} />
                </div>
                <div>
                  <strong>Real-time Insights</strong>
                  <span>Track important pandemic data</span>
                </div>
              </div>

              <div className="brand-feature">
                <div className="feature-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong>Secure Access</strong>
                  <span>Role-based protected platform</span>
                </div>
              </div>
            </div>

            <div className="brand-footer">
              <span>© {new Date().getFullYear()} Pandemic Tracker</span>
              <span>Secure Monitoring System</span>
            </div>

          </div>
        </div>

        {/* Login Panel */}
        <div className="auth-form-panel">
          <div className="auth-card premium-auth-card">

            <div className="mobile-brand-icon">
              <Activity size={25} />
            </div>

            <div className="auth-heading">
              <span className="auth-eyebrow">WELCOME BACK</span>
              <h2>Sign in to your account</h2>
              <p>
                Enter your credentials to access the monitoring dashboard.
              </p>
            </div>

            {error && (
              <div className="premium-alert premium-alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="premium-login-form">

              {/* Email */}
              <div className="premium-form-group">
                <label htmlFor="email">Email Address</label>

                <div className="premium-input-wrapper">
                  <Mail size={18} className="input-icon" />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="premium-form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="premium-form-group">
                <div className="password-label-row">
                  <label htmlFor="password">Password</label>
                </div>

                <div className="premium-input-wrapper">
                  <Lock size={18} className="input-icon" />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="premium-form-control password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="premium-login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={19} className="spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            {/* Register */}
            <div className="register-link">
              <span>Don't have an account?</span>
              <Link to="/register">
                Create account
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Demo Accounts */}
            <div className="demo-section">
              <div className="demo-header">
                <div className="demo-line" />
                <span>DEMO ACCOUNTS</span>
                <div className="demo-line" />
              </div>

              <div className="demo-accounts">

                <div className="demo-account">
                  <div className="demo-role admin-role">A</div>
                  <div className="demo-details">
                    <strong>Administrator</strong>
                    <span>admin@pandemic.com</span>
                  </div>
                  <code>admin123</code>
                </div>

                <div className="demo-account">
                  <div className="demo-role worker-role">W</div>
                  <div className="demo-details">
                    <strong>Worker</strong>
                    <span>worker@pandemic.com</span>
                  </div>
                  <code>worker123</code>
                </div>

                <div className="demo-account">
                  <div className="demo-role viewer-role">V</div>
                  <div className="demo-details">
                    <strong>Viewer</strong>
                    <span>viewer@pandemic.com</span>
                  </div>
                  <code>viewer123</code>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
