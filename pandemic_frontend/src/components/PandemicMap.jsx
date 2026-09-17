
import { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  MapPin,
  ShieldAlert,
  Skull,
  TrendingUp,
} from 'lucide-react';

import '../css/Map.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const RISK_COLORS = {
  low: '#16a34a',
  moderate: '#d97706',
  high: '#ea580c',
  critical: '#dc2626',
};

const RISK_LABELS = {
  low: 'Low Risk',
  moderate: 'Moderate',
  high: 'High Risk',
  critical: 'Critical',
};

const RISK_ICONS = {
  low: CheckCircle2,
  moderate: AlertTriangle,
  high: CircleAlert,
  critical: ShieldAlert,
};

function FitBounds({ areas }) {
  const map = useMap();

  useEffect(() => {
    if (areas?.length) {
      const points = areas
        .filter(
          (a) =>
            a.center?.coordinates &&
            a.center.coordinates.length === 2
        )
        .map((a) => [
          a.center.coordinates[1],
          a.center.coordinates[0],
        ]);

      if (points.length) {
        map.fitBounds(L.latLngBounds(points), {
          padding: [50, 50],
        });
      }
    }
  }, [areas, map]);

  return null;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function RiskIcon({ risk }) {
  const Icon = RISK_ICONS[risk] || Activity;
  return <Icon size={14} strokeWidth={2.5} />;
}

export default function PandemicMap({
  areas = [],
  height = 520,
  zoom = 5,
}) {
  const center =
    areas.length && areas[0].center?.coordinates
      ? [
          areas[0].center.coordinates[1],
          areas[0].center.coordinates[0],
        ]
      : [30.3753, 69.3451];

  const riskCounts = areas.reduce(
    (acc, area) => {
      const risk = area.riskLevel || 'low';

      if (acc[risk] !== undefined) {
        acc[risk] += 1;
      }

      return acc;
    },
    {
      low: 0,
      moderate: 0,
      high: 0,
      critical: 0,
    }
  );

  return (
    <div
      className="pandemic-map-shell"
      style={{ height }}
    >
      {/* Floating Header */}
      <div className="pandemic-map-floating-header">
        <div className="pandemic-map-title-group">
          <div className="pandemic-map-icon">
            <MapPin size={18} />
          </div>

          <div>
            <div className="pandemic-map-eyebrow">
              GEOGRAPHIC MONITORING
            </div>

            <h3 className="pandemic-map-title">
              Pandemic Risk Map
            </h3>
          </div>
        </div>

        <div className="pandemic-map-live">
          <span className="pandemic-live-dot" />
          <span>LIVE DATA</span>
        </div>
      </div>

      {/* Map */}
      <div className="pandemic-map-container">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{
            height: '100%',
            width: '100%',
          }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {areas.map((area) => {
            if (!area.center?.coordinates) return null;

            const [lng, lat] = area.center.coordinates;

            const risk = area.riskLevel || 'low';
            const color = RISK_COLORS[risk] || '#64748b';

            const radius = Math.min(
              28,
              Math.max(
                8,
                6 +
                  Math.sqrt(area.activeCases || 0) * 1.5
              )
            );

            return (
              <CircleMarker
                key={area._id}
                center={[lat, lng]}
                radius={radius}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.68,
                  weight: 3,
                  opacity: 0.95,
                }}
              >
                <Popup className="premium-map-popup">
                  <div className="map-popup-content">
                    {/* Popup Header */}
                    <div className="map-popup-header">
                      <div className="map-popup-location-icon">
                        <MapPin size={17} />
                      </div>

                      <div className="map-popup-heading">
                        <h4>{area.name}</h4>

                        <span>
                          {area.city?.name ||
                            area.country?.name ||
                            'Monitored Area'}
                        </span>
                      </div>
                    </div>

                    {/* Risk */}
                    <div
                      className="map-popup-risk"
                      style={{
                        color,
                        backgroundColor: `${color}14`,
                        borderColor: `${color}35`,
                      }}
                    >
                      <RiskIcon risk={risk} />

                      <span>
                        {RISK_LABELS[risk] ||
                          risk.toUpperCase()}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="map-popup-location">
                      {area.city?.name && (
                        <div>
                          <span>City</span>
                          <strong>{area.city.name}</strong>
                        </div>
                      )}

                      {area.country?.name && (
                        <div>
                          <span>Country</span>
                          <strong>{area.country.name}</strong>
                        </div>
                      )}
                    </div>

                    {/* Statistics */}
                    <div className="map-popup-stats">
                      <div className="map-popup-stat active">
                        <Activity size={15} />

                        <div>
                          <span>Active</span>
                          <strong>
                            {formatNumber(area.activeCases)}
                          </strong>
                        </div>
                      </div>

                      <div className="map-popup-stat total">
                        <TrendingUp size={15} />

                        <div>
                          <span>Total</span>
                          <strong>
                            {formatNumber(area.totalCases)}
                          </strong>
                        </div>
                      </div>

                      <div className="map-popup-stat recovered">
                        <CheckCircle2 size={15} />

                        <div>
                          <span>Recovered</span>
                          <strong>
                            {formatNumber(
                              area.totalRecovered
                            )}
                          </strong>
                        </div>
                      </div>

                      <div className="map-popup-stat deaths">
                        <Skull size={15} />

                        <div>
                          <span>Deaths</span>
                          <strong>
                            {formatNumber(area.totalDeaths)}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="map-popup-footer">
                      <span>Monitoring status</span>

                      <span className="map-popup-status">
                        <span />
                        Active
                      </span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          <FitBounds areas={areas} />
        </MapContainer>
      </div>

      {/* Bottom Legend */}
      <div className="pandemic-map-bottom-bar">
        <div className="pandemic-map-area-count">
          <div className="area-count-icon">
            <Activity size={15} />
          </div>

          <div>
            <strong>{areas.length}</strong>
            <span>Areas monitored</span>
          </div>
        </div>

        <div className="pandemic-risk-legend">
          {Object.entries(RISK_COLORS).map(
            ([risk, color]) => (
              <div
                className="pandemic-risk-item"
                key={risk}
              >
                <span
                  className="pandemic-risk-dot"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 0 3px ${color}18`,
                  }}
                />

                <span>
                  {RISK_LABELS[risk]}
                </span>

                <strong>{riskCounts[risk]}</strong>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
