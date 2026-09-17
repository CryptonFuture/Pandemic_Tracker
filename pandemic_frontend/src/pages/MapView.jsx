
import { useEffect, useState } from 'react';
import api from '../services/api';
import PandemicMap from '../components/PandemicMap';
import {
  Globe2,
  Map,
  MapPin,
  Navigation,
  Activity,
  Filter,
  RefreshCw,
  Layers3,
  ChevronDown,
} from 'lucide-react';
import "../css/MapView.css"

export default function MapView() {
  const [areas, setAreas] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    riskLevel: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/locations/countries').then((r) => {
      setCountries(r.data);
    });
  }, []);

  useEffect(() => {
    if (filters.country) {
      api
        .get(`/locations/cities?country=${filters.country}`)
        .then((r) => setCities(r.data));
    } else {
      setCities([]);
      setFilters((f) => ({ ...f, city: '' }));
    }
  }, [filters.country]);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();

    if (filters.country) {
      params.set('country', filters.country);
    }

    if (filters.city) {
      params.set('city', filters.city);
    }

    if (filters.riskLevel) {
      params.set('riskLevel', filters.riskLevel);
    }

    api
      .get(`/locations/map-data?${params}`)
      .then((r) => setAreas(r.data))
      .finally(() => setLoading(false));
  }, [filters]);

  const hasFilters =
    filters.country ||
    filters.city ||
    filters.riskLevel;

  const clearFilters = () => {
    setFilters({
      country: '',
      city: '',
      riskLevel: '',
    });
  };

  return (
    <div className="container page premium-map-page">

      {/* =========================================
          PAGE HEADER
      ========================================== */}

      <div className="map-page-header">

        <div>
          <div className="map-eyebrow">
            <span className="map-live-dot" />
            LIVE GEOGRAPHIC MONITORING
          </div>

          <h1>
            Pandemic <span>Risk Map</span>
          </h1>

          <p>
            Explore pandemic activity and risk levels across
            countries, cities and local areas.
          </p>
        </div>

        <div className="map-header-status">
          <div className="status-icon">
            <Globe2 size={18} />
          </div>

          <div>
            <span>AREAS MONITORED</span>
            <strong>{areas.length.toLocaleString()}</strong>
          </div>
        </div>

      </div>

      {/* =========================================
          MAIN MAP CARD
      ========================================== */}

      <div className="premium-map-card">

        {/* Card Header */}
        <div className="map-card-header">

          <div className="map-card-title">
            <div className="map-title-icon">
              <Map size={19} />
            </div>

            <div>
              <div className="section-label">
                <Navigation size={12} />
                GEOGRAPHIC VIEW
              </div>

              <h2>Live Monitoring Map</h2>

              <p>
                Filter the map to explore specific locations and
                risk levels.
              </p>
            </div>
          </div>

          <div className="map-data-status">
            <span />
            Live Data
          </div>

        </div>

        {/* =========================================
            FILTERS
        ========================================== */}

        <div className="premium-map-filters">

          <div className="filter-heading">
            <div className="filter-heading-icon">
              <Filter size={16} />
            </div>

            <div>
              <strong>Map Filters</strong>
              <span>
                Narrow down the displayed locations
              </span>
            </div>

            {hasFilters && (
              <button
                type="button"
                className="clear-filter-btn"
                onClick={clearFilters}
              >
                <RefreshCw size={13} />
                Reset
              </button>
            )}
          </div>

          <div className="premium-filter-grid">

            {/* Country */}
            <div className="premium-filter-group">

              <label htmlFor="country">
                <Globe2 size={13} />
                Country
              </label>

              <div className="premium-select-wrapper">

                <Globe2 className="premium-select-icon" size={17} />

                <select
                  id="country"
                  className="premium-map-select"
                  value={filters.country}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      country: e.target.value,
                      city: '',
                    })
                  }
                >
                  <option value="">All Countries</option>

                  {countries.map((c) => (
                    <option
                      key={c._id}
                      value={c._id}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={15}
                  className="select-chevron"
                />

              </div>

            </div>

            {/* City */}
            <div className="premium-filter-group">

              <label htmlFor="city">
                <MapPin size={13} />
                City
              </label>

              <div
                className={`premium-select-wrapper ${
                  !filters.country ? 'is-disabled' : ''
                }`}
              >

                <MapPin
                  className="premium-select-icon"
                  size={17}
                />

                <select
                  id="city"
                  className="premium-map-select"
                  value={filters.city}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      city: e.target.value,
                    })
                  }
                  disabled={!filters.country}
                >
                  <option value="">
                    {filters.country
                      ? 'All Cities'
                      : 'Select country first'}
                  </option>

                  {cities.map((c) => (
                    <option
                      key={c._id}
                      value={c._id}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={15}
                  className="select-chevron"
                />

              </div>

            </div>

            {/* Risk */}
            <div className="premium-filter-group">

              <label htmlFor="riskLevel">
                <Activity size={13} />
                Risk Level
              </label>

              <div className="premium-select-wrapper">

                <Activity
                  className="premium-select-icon"
                  size={17}
                />

                <select
                  id="riskLevel"
                  className="premium-map-select"
                  value={filters.riskLevel}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      riskLevel: e.target.value,
                    })
                  }
                >
                  <option value="">All Risk Levels</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>

                <ChevronDown
                  size={15}
                  className="select-chevron"
                />

              </div>

            </div>

          </div>

          {/* Active Filters */}
          {hasFilters && (
            <div className="active-filters">

              <span className="active-filter-label">
                Active filters:
              </span>

              {filters.country && (
                <span className="filter-pill">
                  <Globe2 size={11} />
                  Country selected
                </span>
              )}

              {filters.city && (
                <span className="filter-pill">
                  <MapPin size={11} />
                  City selected
                </span>
              )}

              {filters.riskLevel && (
                <span className="filter-pill">
                  <Activity size={11} />
                  {filters.riskLevel}
                </span>
              )}

            </div>
          )}

        </div>

        {/* =========================================
            MAP
        ========================================== */}

        <div className="premium-map-wrapper">

          {loading ? (
            <div className="premium-map-loading">

              <div className="map-loader">
                <div className="map-loader-ring" />
                <Map size={22} />
              </div>

              <strong>
                Loading map data
              </strong>

              <span>
                Updating geographic risk information...
              </span>

            </div>
          ) : (
            <PandemicMap
              areas={areas}
              height={560}
              zoom={6}
            />
          )}

        </div>

        {/* =========================================
            MAP FOOTER / LEGEND
        ========================================== */}

        {!loading && (
          <div className="premium-map-footer">

            <div className="premium-map-legend">

              <span className="legend-title">
                Risk Level
              </span>

              <span>
                <i className="premium-dot dot-low" />
                Low
              </span>

              <span>
                <i className="premium-dot dot-moderate" />
                Moderate
              </span>

              <span>
                <i className="premium-dot dot-high" />
                High
              </span>

              <span>
                <i className="premium-dot dot-critical" />
                Critical
              </span>

            </div>

            <div className="areas-count">
              <Layers3 size={14} />
              <strong>{areas.length}</strong>
              areas shown
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

