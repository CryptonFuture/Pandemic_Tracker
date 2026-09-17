
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  FileText,
  Globe2,
  HeartPulse,
  Loader2,
  MapPin,
  NotebookPen,
  Send,
  Skull,
  TrendingUp,
} from 'lucide-react';
import "../css/Cases.css"

export default function ReportCases() {
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const [form, setForm] = useState({
    countryId: '',
    cityId: '',
    areaId: '',
    newCases: 0,
    recovered: 0,
    deaths: 0,
    notes: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/locations/countries').then(r => setCountries(r.data));
  }, []);

  useEffect(() => {
    if (form.countryId) {
      api
        .get(`/locations/cities?country=${form.countryId}`)
        .then(r => setCities(r.data));
    } else {
      setCities([]);
      setForm(f => ({
        ...f,
        cityId: '',
        areaId: '',
      }));
    }
  }, [form.countryId]);

  useEffect(() => {
    if (form.cityId) {
      api
        .get(`/locations/areas?city=${form.cityId}`)
        .then(r => setAreas(r.data));
    } else {
      setAreas([]);
      setForm(f => ({
        ...f,
        areaId: '',
      }));
    }
  }, [form.cityId]);

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/cases', {
        areaId: form.areaId,
        newCases: Number(form.newCases),
        recovered: Number(form.recovered),
        deaths: Number(form.deaths),
        notes: form.notes,
      });

      setSuccess(
        'Cases reported successfully. Totals updated.'
      );

      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to report'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page premium-report-page">
      {/* Header */}
      <div className="report-page-header">
        <div className="report-title-row">
          <div className="report-title-icon">
            <NotebookPen size={23} />
          </div>

          <div>
            <div className="report-eyebrow">
              <span className="report-live-dot" />
              CASE MANAGEMENT
              <span className="report-divider">•</span>
              NEW REPORT
            </div>

            <h1>Report New Cases</h1>

            <p>
              Submit the latest pandemic case information for a
              specific country, city and monitored area.
            </p>
          </div>
        </div>

        <div className="report-header-badge">
          <Activity size={15} />
          <span>Reporting System Active</span>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="premium-report-alert report-alert-error">
          <div className="report-alert-icon">
            <AlertCircle size={19} />
          </div>

          <div>
            <strong>Unable to submit report</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="premium-report-alert report-alert-success">
          <div className="report-alert-icon">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <strong>Report submitted successfully</strong>
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="report-layout">
        {/* Form Card */}
        <div className="premium-report-card">
          <div className="report-card-header">
            <div>
              <div className="report-card-title">
                <FileText size={19} />
                <h2>Case Report Details</h2>
              </div>

              <p>
                Select the reporting location and enter today's
                case statistics.
              </p>
            </div>

            <div className="required-badge">
              * Required
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="premium-report-form"
          >
            {/* Location Section */}
            <div className="report-section">
              <div className="report-section-heading">
                <div className="section-number">01</div>

                <div>
                  <h3>Reporting Location</h3>
                  <span>
                    Select the geographical area for this report
                  </span>
                </div>
              </div>

              <div className="report-location-grid">
                {/* Country */}
                <div className="premium-report-field">
                  <label>
                    <Globe2 size={14} />
                    Country
                    <span>*</span>
                  </label>

                  <div className="premium-input-wrapper">
                    <select
                      name="countryId"
                      value={form.countryId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select country...
                      </option>

                      {countries.map(c => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <small>
                    Choose the country where cases were recorded.
                  </small>
                </div>

                {/* City */}
                <div className="premium-report-field">
                  <label>
                    <MapPin size={14} />
                    City
                    <span>*</span>
                  </label>

                  <div
                    className={`premium-input-wrapper ${
                      !form.countryId
                        ? 'field-disabled'
                        : ''
                    }`}
                  >
                    <select
                      name="cityId"
                      value={form.cityId}
                      onChange={handleChange}
                      required
                      disabled={!form.countryId}
                    >
                      <option value="">
                        {form.countryId
                          ? 'Select city...'
                          : 'Select country first'}
                      </option>

                      {cities.map(c => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <small>
                    Cities become available after selecting a country.
                  </small>
                </div>

                {/* Area */}
                <div className="premium-report-field full-field">
                  <label>
                    <MapPin size={14} />
                    Monitored Area
                    <span>*</span>
                  </label>

                  <div
                    className={`premium-input-wrapper ${
                      !form.cityId
                        ? 'field-disabled'
                        : ''
                    }`}
                  >
                    <select
                      name="areaId"
                      value={form.areaId}
                      onChange={handleChange}
                      required
                      disabled={!form.cityId}
                    >
                      <option value="">
                        {form.cityId
                          ? 'Select area...'
                          : 'Select city first'}
                      </option>

                      {areas.map(a => (
                        <option key={a._id} value={a._id}>
                          {a.name} (Active: {a.activeCases})
                        </option>
                      ))}
                    </select>
                  </div>

                  <small>
                    Select the exact area where this report belongs.
                  </small>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="report-section">
              <div className="report-section-heading">
                <div className="section-number">02</div>

                <div>
                  <h3>Case Statistics</h3>
                  <span>
                    Enter the latest numbers for the selected area
                  </span>
                </div>
              </div>

              <div className="report-stat-inputs">
                {/* New Cases */}
                <div className="premium-number-field new-cases-field">
                  <div className="number-field-top">
                    <div className="number-field-icon">
                      <TrendingUp size={18} />
                    </div>

                    <div>
                      <label>New Cases</label>
                      <span>Newly reported infections</span>
                    </div>
                  </div>

                  <div className="number-input-wrapper">
                    <span>+</span>

                    <input
                      type="number"
                      name="newCases"
                      min="0"
                      value={form.newCases}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Recovered */}
                <div className="premium-number-field recovered-field">
                  <div className="number-field-top">
                    <div className="number-field-icon">
                      <CheckCircle2 size={18} />
                    </div>

                    <div>
                      <label>Recovered</label>
                      <span>Patients who recovered</span>
                    </div>
                  </div>

                  <div className="number-input-wrapper">
                    <span>+</span>

                    <input
                      type="number"
                      name="recovered"
                      min="0"
                      value={form.recovered}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Deaths */}
                <div className="premium-number-field deaths-field">
                  <div className="number-field-top">
                    <div className="number-field-icon">
                      <Skull size={18} />
                    </div>

                    <div>
                      <label>Deaths</label>
                      <span>Reported fatalities</span>
                    </div>
                  </div>

                  <div className="number-input-wrapper">
                    <span>+</span>

                    <input
                      type="number"
                      name="deaths"
                      min="0"
                      value={form.deaths}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="report-section">
              <div className="report-section-heading">
                <div className="section-number">03</div>

                <div>
                  <h3>Additional Notes</h3>
                  <span>
                    Add any relevant information about this report
                  </span>
                </div>
              </div>

              <div className="premium-report-field">
                <label>
                  <FileText size={14} />
                  Notes
                  <span className="optional-label">
                    Optional
                  </span>
                </label>

                <textarea
                  name="notes"
                  rows={4}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Enter additional information, observations or reporting notes..."
                />

                <small>
                  Keep notes concise and relevant to this case report.
                </small>
              </div>
            </div>

            {/* Submit */}
            <div className="report-submit-area">
              <div className="report-submit-info">
                <HeartPulse size={18} />

                <div>
                  <strong>Ready to submit?</strong>
                  <span>
                    Verify the location and statistics before
                    submitting.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="premium-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="submit-spinner"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Side Information */}
        <aside className="report-side-panel">
          <div className="report-side-card">
            <div className="side-card-icon">
              <HeartPulse size={21} />
            </div>

            <h3>Reporting Guidelines</h3>

            <p>
              Make sure the submitted information is accurate and
              corresponds to the selected monitored area.
            </p>

            <div className="guideline-list">
              <div>
                <CheckCircle2 size={15} />
                <span>Select the correct location</span>
              </div>

              <div>
                <CheckCircle2 size={15} />
                <span>Enter non-negative case numbers</span>
              </div>

              <div>
                <CheckCircle2 size={15} />
                <span>Review data before submitting</span>
              </div>

              <div>
                <CheckCircle2 size={15} />
                <span>Add notes when additional context is needed</span>
              </div>
            </div>
          </div>

          <div className="report-side-card report-info-card">
            <div className="side-card-icon">
              <Activity size={20} />
            </div>

            <h3>Automatic Updates</h3>

            <p>
              After submission, the selected area's case totals
              are updated automatically by the system.
            </p>

            <div className="info-status">
              <span />
              System synchronized
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
