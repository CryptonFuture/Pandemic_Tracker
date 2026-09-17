
import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Globe2,
  MapPin,
  RefreshCw,
  Skull,
  Users,
  Filter,
  Layers3,
} from 'lucide-react';
import "../css/Areas.css"

export default function Areas() {
  const [areas, setAreas] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filterCountry, setFilterCountry] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/locations/countries').then(r => setCountries(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);

    const url = filterCountry
      ? `/locations/areas?country=${filterCountry}`
      : '/locations/areas';

    api
      .get(url)
      .then(r => setAreas(r.data))
      .finally(() => setLoading(false));
  }, [filterCountry]);

  const stats = useMemo(() => {
    return areas.reduce(
      (acc, area) => {
        acc.active += Number(area.activeCases || 0);
        acc.total += Number(area.totalCases || 0);
        acc.recovered += Number(area.totalRecovered || 0);
        acc.deaths += Number(area.totalDeaths || 0);
        acc.population += Number(area.population || 0);

        if (area.riskLevel) {
          acc.risk[area.riskLevel] =
            (acc.risk[area.riskLevel] || 0) + 1;
        }

        return acc;
      },
      {
        active: 0,
        total: 0,
        recovered: 0,
        deaths: 0,
        population: 0,
        risk: {},
      }
    );
  }, [areas]);

  const clearFilter = () => {
    setFilterCountry('');
  };

  const formatNumber = value =>
    Number(value || 0).toLocaleString();

  const getRiskIcon = risk => {
    switch (risk) {
      case 'low':
        return <CheckCircle2 size={14} />;
      case 'moderate':
        return <AlertTriangle size={14} />;
      case 'high':
        return <AlertTriangle size={14} />;
      case 'critical':
        return <Skull size={14} />;
      default:
        return <Activity size={14} />;
    }
  };

  return (
    <div className="container page premium-areas-page">
      {/* Header */}
      <div className="areas-page-header">
        <div className="areas-header-content">
          <div className="areas-title-row">
            <div className="areas-title-icon">
              <Layers3 size={22} />
            </div>

            <div>
              <div className="areas-eyebrow">
                <span className="live-indicator">
                  <span />
                  LIVE DATA
                </span>
                <span className="eyebrow-divider">•</span>
                GEOGRAPHIC MONITORING
              </div>

              <h1>Areas Overview</h1>

              <p>
                Monitor pandemic activity, population exposure and
                risk levels across monitored areas.
              </p>
            </div>
          </div>
        </div>

        <div className="areas-header-actions">
          <div className="areas-count-badge">
            <MapPin size={16} />
            <span>{areas.length} Areas</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="areas-stats-grid">
        <div className="areas-stat-card areas-stat-active">
          <div className="areas-stat-top">
            <div className="areas-stat-icon">
              <Activity size={20} />
            </div>
            <span className="areas-stat-label">Active Cases</span>
          </div>

          <div className="areas-stat-value">
            {formatNumber(stats.active)}
          </div>

          <div className="areas-stat-footer">
            <span>Currently active</span>
          </div>
        </div>

        <div className="areas-stat-card areas-stat-total">
          <div className="areas-stat-top">
            <div className="areas-stat-icon">
              <Globe2 size={20} />
            </div>
            <span className="areas-stat-label">Total Cases</span>
          </div>

          <div className="areas-stat-value">
            {formatNumber(stats.total)}
          </div>

          <div className="areas-stat-footer">
            <span>All reported cases</span>
          </div>
        </div>

        <div className="areas-stat-card areas-stat-recovered">
          <div className="areas-stat-top">
            <div className="areas-stat-icon">
              <CheckCircle2 size={20} />
            </div>
            <span className="areas-stat-label">Recovered</span>
          </div>

          <div className="areas-stat-value">
            {formatNumber(stats.recovered)}
          </div>

          <div className="areas-stat-footer">
            <span>Successfully recovered</span>
          </div>
        </div>

        <div className="areas-stat-card areas-stat-deaths">
          <div className="areas-stat-top">
            <div className="areas-stat-icon">
              <Skull size={20} />
            </div>
            <span className="areas-stat-label">Deaths</span>
          </div>

          <div className="areas-stat-value">
            {formatNumber(stats.deaths)}
          </div>

          <div className="areas-stat-footer">
            <span>Reported fatalities</span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="premium-areas-card">
        {/* Card Header */}
        <div className="areas-card-header">
          <div>
            <div className="areas-card-title">
              <MapPin size={19} />
              <h2>Monitored Areas</h2>
            </div>

            <p>
              Area-level pandemic statistics and risk information
            </p>
          </div>

          <div className="areas-card-status">
            <span className="status-dot" />
            Monitoring Active
          </div>
        </div>

        {/* Filter */}
        <div className="areas-filter-panel">
          <div className="areas-filter-heading">
            <div className="filter-heading-icon">
              <Filter size={17} />
            </div>

            <div>
              <strong>Filter Areas</strong>
              <span>Choose a country to narrow the results</span>
            </div>
          </div>

          <div className="areas-filter-control">
            <Globe2 size={17} />

            <select
              value={filterCountry}
              onChange={e => setFilterCountry(e.target.value)}
              className="areas-country-select"
            >
              <option value="">All Countries</option>

              {countries.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {filterCountry && (
            <button
              type="button"
              className="areas-clear-filter"
              onClick={clearFilter}
            >
              <RefreshCw size={14} />
              Clear
            </button>
          )}
        </div>

        {/* Risk Summary */}
        {!loading && areas.length > 0 && (
          <div className="areas-risk-summary">
            <div className="risk-summary-label">
              Risk Distribution
            </div>

            <div className="risk-summary-items">
              <div className="risk-summary-item risk-low">
                <span className="risk-summary-dot" />
                <span>Low</span>
                <strong>{stats.risk.low || 0}</strong>
              </div>

              <div className="risk-summary-item risk-moderate">
                <span className="risk-summary-dot" />
                <span>Moderate</span>
                <strong>{stats.risk.moderate || 0}</strong>
              </div>

              <div className="risk-summary-item risk-high">
                <span className="risk-summary-dot" />
                <span>High</span>
                <strong>{stats.risk.high || 0}</strong>
              </div>

              <div className="risk-summary-item risk-critical">
                <span className="risk-summary-dot" />
                <span>Critical</span>
                <strong>{stats.risk.critical || 0}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="premium-areas-table-wrapper">
          {loading ? (
            <div className="areas-loading">
              <div className="areas-loading-spinner">
                <RefreshCw size={22} />
              </div>

              <strong>Loading area data</strong>
              <span>Fetching the latest monitoring information...</span>
            </div>
          ) : areas.length === 0 ? (
            <div className="areas-empty">
              <div className="areas-empty-icon">
                <MapPin size={25} />
              </div>

              <h3>No areas found</h3>

              <p>
                There are no monitored areas matching the selected
                country.
              </p>

              {filterCountry && (
                <button
                  type="button"
                  className="areas-empty-btn"
                  onClick={clearFilter}
                >
                  <RefreshCw size={15} />
                  View All Areas
                </button>
              )}
            </div>
          ) : (
            <div className="table-scroll">
              <table className="premium-areas-table">
                <thead>
                  <tr>
                    <th>Area</th>
                    <th>City</th>
                    <th>Country</th>
                    <th>Active</th>
                    <th>Total</th>
                    <th>Recovered</th>
                    <th>Deaths</th>
                    <th>Risk</th>
                    <th>Population</th>
                  </tr>
                </thead>

                <tbody>
                  {areas.map(a => (
                    <tr key={a._id}>
                      <td>
                        <div className="area-name-cell">
                          <div className="area-mini-icon">
                            <MapPin size={15} />
                          </div>

                          <div>
                            <strong>{a.name}</strong>
                            <span>Monitored area</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="location-cell">
                          <MapPin size={14} />
                          {a.city?.name || '—'}
                        </div>
                      </td>

                      <td>
                        <div className="location-cell">
                          <Globe2 size={14} />
                          {a.country?.name || '—'}
                        </div>
                      </td>

                      <td>
                        <span className="case-number active-number">
                          {formatNumber(a.activeCases)}
                        </span>
                      </td>

                      <td>
                        <span className="case-number">
                          {formatNumber(a.totalCases)}
                        </span>
                      </td>

                      <td>
                        <span className="case-number recovered-number">
                          {formatNumber(a.totalRecovered)}
                        </span>
                      </td>

                      <td>
                        <span className="case-number death-number">
                          {formatNumber(a.totalDeaths)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`premium-risk-badge risk-${a.riskLevel}`}
                        >
                          {getRiskIcon(a.riskLevel)}
                          {a.riskLevel || 'Unknown'}
                        </span>
                      </td>

                      <td>
                        <div className="population-cell">
                          <Users size={14} />
                          {formatNumber(a.population)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && areas.length > 0 && (
          <div className="areas-table-footer">
            <div>
              <span className="footer-live-dot" />
              Data monitoring active
            </div>

            <span>
              Showing <strong>{areas.length}</strong> monitored areas
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

