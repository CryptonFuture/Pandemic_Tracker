
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PandemicMap from '../components/PandemicMap';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Globe2,
  HeartPulse,
  Map,
  MapPin,
  ShieldCheck,
  Skull,
  Users,
} from 'lucide-react';
import "../css/Dashboard.css"

export default function Dashboard() {
  const { user } = useAuth();

  const [summary, setSummary] = useState(null);
  const [mapAreas, setMapAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/cases/summary'),
      api.get('/locations/map-data'),
    ])
      .then(([sumRes, mapRes]) => {
        setSummary(sumRes.data);
        setMapAreas(mapRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const g = summary?.global || {};
  const analytics = summary?.analytics;

  const riskScore = analytics?.overall_risk_score || 0;

  const riskLabel =
    riskScore >= 60
      ? 'Critical'
      : riskScore >= 35
        ? 'Moderate'
        : 'Low';

  const riskClass =
    riskScore >= 60
      ? 'risk-critical'
      : riskScore >= 35
        ? 'risk-moderate'
        : 'risk-low';

  const formatNumber = (value) =>
    Number(value || 0).toLocaleString();

  return (
    <div className="container page premium-dashboard">

      {/* =========================================
          PAGE HEADER
      ========================================== */}

      <div className="dashboard-header">

        <div className="dashboard-heading">
          <div className="dashboard-eyebrow">
            <span className="live-indicator" />
            LIVE MONITORING
          </div>

          <h1>
            Welcome back, <span>{user?.name}</span>
          </h1>

          <p>
            Country, city and area-wise pandemic monitoring
            overview.
          </p>
        </div>

        <div className="dashboard-actions">
          <Link to="/map" className="dashboard-btn dashboard-btn-secondary">
            <Map size={17} />
            Open Full Map
            <ArrowRight size={15} />
          </Link>

          {(user?.role === 'admin' ||
            user?.role === 'health_worker') && (
            <Link
              to="/report"
              className="dashboard-btn dashboard-btn-primary"
            >
              <Activity size={17} />
              Report Cases
            </Link>
          )}
        </div>
      </div>

      {/* =========================================
          KPI CARDS
      ========================================== */}

      <div className="premium-stats-grid">

        {/* Total Cases */}
        <div className="premium-stat-card stat-red">
          <div className="stat-top">
            <div className="stat-icon">
              <Users size={20} />
            </div>

            <span className="stat-status">
              Global
            </span>
          </div>

          <div className="stat-content">
            <span>Total Cases</span>
            <strong>{formatNumber(g.totalCases)}</strong>
          </div>

          <div className="stat-footer">
            <Activity size={13} />
            Reported cases
          </div>
        </div>

        {/* Active */}
        <div className="premium-stat-card stat-orange">
          <div className="stat-top">
            <div className="stat-icon">
              <AlertTriangle size={20} />
            </div>

            <span className="stat-status">
              Active
            </span>
          </div>

          <div className="stat-content">
            <span>Active Cases</span>
            <strong>{formatNumber(g.activeCases)}</strong>
          </div>

          <div className="stat-footer">
            <CircleAlert size={13} />
            Currently active
          </div>
        </div>

        {/* Recovered */}
        <div className="premium-stat-card stat-green">
          <div className="stat-top">
            <div className="stat-icon">
              <CheckCircle2 size={20} />
            </div>

            <span className="stat-status">
              Recovered
            </span>
          </div>

          <div className="stat-content">
            <span>Total Recovered</span>
            <strong>{formatNumber(g.totalRecovered)}</strong>
          </div>

          <div className="stat-footer">
            <HeartPulse size={13} />
            Recovery progress
          </div>
        </div>

        {/* Deaths */}
        <div className="premium-stat-card stat-slate">
          <div className="stat-top">
            <div className="stat-icon">
              <Skull size={20} />
            </div>

            <span className="stat-status">
              Reported
            </span>
          </div>

          <div className="stat-content">
            <span>Total Deaths</span>
            <strong>{formatNumber(g.totalDeaths)}</strong>
          </div>

          <div className="stat-footer">
            <ShieldCheck size={13} />
            Recorded fatalities
          </div>
        </div>

      </div>

      {/* =========================================
          ANALYTICS
      ========================================== */}

      {analytics && (
        <div className="analytics-card">

          <div className="analytics-header">
            <div>
              <div className="section-label">
                <BarChart3 size={15} />
                PYTHON ANALYTICS
              </div>

              <h2>Risk & Health Insights</h2>

              <p>
                Automated analysis based on current pandemic
                statistics.
              </p>
            </div>

            <div className={`overall-risk ${riskClass}`}>
              <div className="risk-icon">
                <AlertTriangle size={17} />
              </div>

              <div>
                <span>Overall Risk</span>
                <strong>
                  {riskLabel}
                </strong>
              </div>

              <div className="risk-score">
                {riskScore}
                <small>/100</small>
              </div>
            </div>
          </div>

          <div className="analytics-body">

            {/* Risk Score */}
            <div className="analytics-metric">
              <div className="metric-icon metric-risk">
                <AlertTriangle size={18} />
              </div>

              <div className="metric-info">
                <span>Overall Risk Score</span>

                <strong className={riskClass}>
                  {riskScore}/100
                </strong>

                <div className="progress-bar">
                  <div
                    className={`progress-fill ${riskClass}`}
                    style={{
                      width: `${Math.min(riskScore, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Recovery */}
            <div className="analytics-metric">
              <div className="metric-icon metric-recovery">
                <HeartPulse size={18} />
              </div>

              <div className="metric-info">
                <span>Recovery Rate</span>

                <strong>
                  {analytics.recovery_rate_pct}%
                </strong>

                <small>
                  Successfully recovered
                </small>
              </div>
            </div>

            {/* Fatality */}
            <div className="analytics-metric">
              <div className="metric-icon metric-fatality">
                <Skull size={18} />
              </div>

              <div className="metric-info">
                <span>Fatality Rate</span>

                <strong>
                  {analytics.fatality_rate_pct}%
                </strong>

                <small>
                  Recorded fatality percentage
                </small>
              </div>
            </div>

          </div>

          {/* Recommendation */}
          {analytics.recommendation && (
            <div className="recommendation-box">
              <div className="recommendation-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <span>Analytics Recommendation</span>
                <p>{analytics.recommendation}</p>
              </div>
            </div>
          )}

          {/* Hotspots */}
          {analytics.hotspots?.length > 0 && (
            <div className="hotspots-section">

              <div className="hotspots-heading">
                <div>
                  <h3>Top Hotspots</h3>
                  <span>
                    Areas with highest active cases
                  </span>
                </div>

                <MapPin size={18} />
              </div>

              <div className="hotspots-list">
                {analytics.hotspots
                  .slice(0, 5)
                  .map((h, index) => (
                    <div
                      className="hotspot-item"
                      key={`${h.name}-${index}`}
                    >
                      <div className="hotspot-rank">
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      <div className="hotspot-info">
                        <strong>{h.name}</strong>
                        <span>Active cases</span>
                      </div>

                      <div className="hotspot-count">
                        {formatNumber(h.active)}
                      </div>

                      <ChevronRight size={15} />
                    </div>
                  ))}
              </div>

            </div>
          )}

        </div>
      )}

      {/* =========================================
          LIVE MAP
      ========================================== */}

      <div className="premium-card map-card">

        <div className="premium-card-header">
          <div className="card-heading-icon">
            <Globe2 size={19} />
          </div>

          <div>
            <div className="section-label">
              LIVE DATA
            </div>

            <h2>Live Risk Map</h2>

            <p>
              Geographic overview of reported pandemic activity.
            </p>
          </div>

          <div className="map-live-badge">
            <span />
            Live
          </div>
        </div>

        <div className="map-container">
          {loading ? (
            <div className="map-loading">
              <div className="loading-spinner" />
              <span>Loading risk map...</span>
            </div>
          ) : (
            <PandemicMap
              areas={mapAreas}
              height={420}
            />
          )}
        </div>

        {!loading && (
          <div className="premium-risk-legend">

            <span>
              <i className="legend-dot legend-low" />
              Low
            </span>

            <span>
              <i className="legend-dot legend-moderate" />
              Moderate
            </span>

            <span>
              <i className="legend-dot legend-high" />
              High
            </span>

            <span>
              <i className="legend-dot legend-critical" />
              Critical
            </span>

          </div>
        )}

      </div>

      {/* =========================================
          COUNTRY TABLE
      ========================================== */}

      {summary?.countries?.length > 0 && (
        <div className="premium-card country-card">

          <div className="premium-card-header">

            <div className="card-heading-icon">
              <Globe2 size={19} />
            </div>

            <div>
              <div className="section-label">
                GLOBAL OVERVIEW
              </div>

              <h2>Cases by Country</h2>

              <p>
                Current pandemic statistics grouped by country.
              </p>
            </div>

          </div>

          <div className="premium-table-wrapper">
            <table className="premium-table">

              <thead>
                <tr>
                  <th>Country</th>
                  <th>Total Cases</th>
                  <th>Active</th>
                  <th>Recovered</th>
                  <th>Deaths</th>
                </tr>
              </thead>

              <tbody>
                {summary.countries.map((c) => (
                  <tr key={c._id}>

                    <td>
                      <div className="country-name">
                        <div className="country-icon">
                          <Globe2 size={15} />
                        </div>

                        <div>
                          <strong>{c.name}</strong>
                          <span>{c.code}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong>
                        {formatNumber(c.totalCases)}
                      </strong>
                    </td>

                    <td>
                      <span className="table-value active-value">
                        {formatNumber(c.activeCases)}
                      </span>
                    </td>

                    <td>
                      <span className="table-value recovered-value">
                        {formatNumber(c.totalRecovered)}
                      </span>
                    </td>

                    <td>
                      <span className="table-value death-value">
                        {formatNumber(c.totalDeaths)}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      )}

    </div>
  );
}
