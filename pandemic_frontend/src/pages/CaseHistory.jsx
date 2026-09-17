
import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  FileClock,
  Globe2,
  MapPin,
  RefreshCw,
  Skull,
  TrendingUp,
  UserRound,
} from 'lucide-react';
import "../css/History.css"

export default function CaseHistory() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/cases')
      .then(r => setReports(r.data))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    return reports.reduce(
      (acc, report) => {
        acc.newCases += Number(report.newCases || 0);
        acc.recovered += Number(report.recovered || 0);
        acc.deaths += Number(report.deaths || 0);

        if (report.area?._id) {
          acc.areas.add(report.area._id);
        }

        return acc;
      },
      {
        newCases: 0,
        recovered: 0,
        deaths: 0,
        areas: new Set(),
      }
    );
  }, [reports]);

  const formatNumber = value =>
    Number(value || 0).toLocaleString();

  const formatDate = value => {
    if (!value) return '-';

    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container page premium-history-page">
      {/* Header */}
      <div className="history-page-header">
        <div className="history-title-row">
          <div className="history-title-icon">
            <FileClock size={23} />
          </div>

          <div>
            <div className="history-eyebrow">
              <span className="history-live-dot" />
              CASE MANAGEMENT
              <span className="history-divider">•</span>
              REPORT HISTORY
            </div>

            <h1>Case Report History</h1>

            <p>
              Review previously submitted pandemic case reports,
              recovery records and reported fatalities.
            </p>
          </div>
        </div>

        <div className="history-record-badge">
          <FileClock size={16} />
          <span>{reports.length} Reports</span>
        </div>
      </div>

      {/* Summary Stats */}
      {!loading && reports.length > 0 && (
        <div className="history-stats-grid">
          <div className="history-stat-card history-stat-reports">
            <div className="history-stat-header">
              <div className="history-stat-icon">
                <FileClock size={19} />
              </div>
              <span>Total Reports</span>
            </div>

            <strong>{formatNumber(reports.length)}</strong>

            <small>Submitted reports</small>
          </div>

          <div className="history-stat-card history-stat-new">
            <div className="history-stat-header">
              <div className="history-stat-icon">
                <TrendingUp size={19} />
              </div>
              <span>New Cases</span>
            </div>

            <strong>{formatNumber(stats.newCases)}</strong>

            <small>Total newly reported</small>
          </div>

          <div className="history-stat-card history-stat-recovered">
            <div className="history-stat-header">
              <div className="history-stat-icon">
                <CheckCircle2 size={19} />
              </div>
              <span>Recovered</span>
            </div>

            <strong>{formatNumber(stats.recovered)}</strong>

            <small>Total recoveries reported</small>
          </div>

          <div className="history-stat-card history-stat-deaths">
            <div className="history-stat-header">
              <div className="history-stat-icon">
                <Skull size={19} />
              </div>
              <span>Deaths</span>
            </div>

            <strong>{formatNumber(stats.deaths)}</strong>

            <small>Reported fatalities</small>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="premium-history-card">
        <div className="history-card-header">
          <div>
            <div className="history-card-title">
              <Activity size={19} />
              <h2>Submitted Reports</h2>
            </div>

            <p>
              Complete history of case reports received by the system.
            </p>
          </div>

          <div className="history-status">
            <span />
            Data Available
          </div>
        </div>

        {/* Content */}
        <div className="premium-history-table-wrapper">
          {loading ? (
            <div className="history-loading">
              <div className="history-loading-icon">
                <RefreshCw size={22} />
              </div>

              <strong>Loading case history</strong>

              <span>
                Fetching the latest submitted reports...
              </span>
            </div>
          ) : reports.length === 0 ? (
            <div className="history-empty">
              <div className="history-empty-icon">
                <FileClock size={26} />
              </div>

              <h3>No case reports yet</h3>

              <p>
                No case reports have been submitted yet. Use
                “Report Cases” to add new pandemic data.
              </p>
            </div>
          ) : (
            <div className="history-table-scroll">
              <table className="premium-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Area</th>
                    <th>City</th>
                    <th>Country</th>
                    <th>New Cases</th>
                    <th>Recovered</th>
                    <th>Deaths</th>
                    <th>Reported By</th>
                  </tr>
                </thead>

                <tbody>
                  {reports.map(r => (
                    <tr key={r._id}>
                      {/* Date */}
                      <td>
                        <div className="history-date-cell">
                          <div className="history-date-icon">
                            <CalendarDays size={15} />
                          </div>

                          <span>
                            {formatDate(r.reportDate)}
                          </span>
                        </div>
                      </td>

                      {/* Area */}
                      <td>
                        <div className="history-area-cell">
                          <div className="history-area-icon">
                            <MapPin size={15} />
                          </div>

                          <div>
                            <strong>
                              {r.area?.name || '-'}
                            </strong>
                            <small>Monitored area</small>
                          </div>
                        </div>
                      </td>

                      {/* City */}
                      <td>
                        <div className="history-location-cell">
                          <MapPin size={14} />
                          {r.city?.name || '-'}
                        </div>
                      </td>

                      {/* Country */}
                      <td>
                        <div className="history-location-cell">
                          <Globe2 size={14} />
                          {r.country?.name || '-'}
                        </div>
                      </td>

                      {/* New Cases */}
                      <td>
                        <span className="history-number history-new-number">
                          +{formatNumber(r.newCases)}
                        </span>
                      </td>

                      {/* Recovered */}
                      <td>
                        <span className="history-number history-recovered-number">
                          +{formatNumber(r.recovered)}
                        </span>
                      </td>

                      {/* Deaths */}
                      <td>
                        <span className="history-number history-death-number">
                          {formatNumber(r.deaths)}
                        </span>
                      </td>

                      {/* Reporter */}
                      <td>
                        <div className="history-reporter-cell">
                          <div className="history-user-icon">
                            <UserRound size={14} />
                          </div>

                          <span>
                            {r.reportedBy?.name || '-'}
                          </span>
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
        {!loading && reports.length > 0 && (
          <div className="history-card-footer">
            <div>
              <span className="footer-status-dot" />
              Case reporting system active
            </div>

            <div>
              <span>
                Showing <strong>{reports.length}</strong> reports
              </span>

              <span className="footer-separator">•</span>

              <span>
                <strong>{stats.areas.size}</strong> areas represented
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
