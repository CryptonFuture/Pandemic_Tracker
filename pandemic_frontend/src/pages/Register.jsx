
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Activity,
  Loader2,
  AlertCircle,
  UserRoundPlus,
} from 'lucide-react';
import "../css/Register.css"

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'viewer',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed'
      );
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

        {/* =====================================
            LEFT BRANDING PANEL
        ====================================== */}

        <div className="auth-brand-panel">
          <div className="brand-content">

            <div className="brand-icon">
              <Activity size={28} strokeWidth={2.4} />
            </div>

            <div className="brand-badge">
              <span className="status-dot" />
              Pandemic Monitoring Platform
            </div>

            <h1>
              Join the
              <span> Network</span>
            </h1>

            <p className="brand-description">
              Create your account and become part of a centralized
              pandemic monitoring platform designed for reliable
              location-based insights.
            </p>

            <div className="brand-features">

              <div className="brand-feature">
                <div className="feature-icon">
                  <UserRoundPlus size={18} />
                </div>

                <div>
                  <strong>Quick Registration</strong>
                  <span>Create your account in seconds</span>
                </div>
              </div>

              <div className="brand-feature">
                <div className="feature-icon">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <strong>Role-Based Access</strong>
                  <span>Choose the access level you need</span>
                </div>
              </div>

              <div className="brand-feature">
                <div className="feature-icon">
                  <Activity size={18} />
                </div>

                <div>
                  <strong>Centralized Monitoring</strong>
                  <span>Access pandemic information efficiently</span>
                </div>
              </div>

            </div>

            <div className="brand-footer">
              <span>© {new Date().getFullYear()} Pandemic Tracker</span>
              <span>Secure Monitoring System</span>
            </div>

          </div>
        </div>

        {/* =====================================
            REGISTER FORM
        ====================================== */}

        <div className="auth-form-panel register-form-panel">

          <div className="auth-card premium-auth-card register-card">

            <div className="mobile-brand-icon">
              <UserRoundPlus size={25} />
            </div>

            <div className="auth-heading">
              <span className="auth-eyebrow">
                GET STARTED
              </span>

              <h2>Create your account</h2>

              <p>
                Register to access the pandemic monitoring platform.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="premium-alert premium-alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="premium-login-form register-form"
            >

              {/* Name */}
              <div className="premium-form-group">
                <label htmlFor="name">
                  Full Name
                </label>

                <div className="premium-input-wrapper">
                  <User
                    size={18}
                    className="input-icon"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="premium-form-control"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="premium-form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <div className="premium-input-wrapper">
                  <Mail
                    size={18}
                    className="input-icon"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="premium-form-control"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="premium-form-group">
                <label htmlFor="password">
                  Password
                </label>

                <div className="premium-input-wrapper">
                  <Lock
                    size={18}
                    className="input-icon"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="premium-form-control password-input"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
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

                <div className="password-hint">
                  Minimum 6 characters
                </div>
              </div>

              {/* Phone */}
              <div className="premium-form-group">
                <label htmlFor="phone">
                  Phone Number
                  <span className="optional-label">
                    Optional
                  </span>
                </label>

                <div className="premium-input-wrapper">
                  <Phone
                    size={18}
                    className="input-icon"
                  />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+92 300 1234567"
                    className="premium-form-control"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="premium-form-group">
                <label htmlFor="role">
                  Account Role
                </label>

                <div className="premium-input-wrapper">
                  <ShieldCheck
                    size={18}
                    className="input-icon"
                  />

                  <select
                    id="role"
                    name="role"
                    className="premium-form-control premium-select"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="viewer">
                      Viewer (Public)
                    </option>

                    <option value="health_worker">
                      Health Worker
                    </option>
                  </select>
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
                    <Loader2
                      size={19}
                      className="spin"
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={19} />
                  </>
                )}
              </button>

            </form>

            {/* Login */}
            <div className="register-link">
              <span>Already have an account?</span>

              <Link to="/login">
                Sign In
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Security Notice */}
            <div className="security-notice">
              <ShieldCheck size={16} />

              <div>
                <strong>Secure Registration</strong>
                <span>
                  Your account information is protected
                  by secure authentication.
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
