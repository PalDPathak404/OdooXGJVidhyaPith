import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation, AlertTriangle, Users, Fuel, Signal, X } from 'lucide-react';
import useFleetStore from '../store/fleetStore';

// Fix Leaflet default icon issue in Vite/webpack builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const fleetVehicles = [
  { id: 'VH-001', name: 'Alpha Transport', type: 'Heavy Truck', status: 'active', lat: 23.0225, lng: 72.5714, speed: 65, fuel: 78, driver: 'John Smith', destination: 'Warehouse A', eta: '14:30', alerts: [] },
  { id: 'VH-002', name: 'Beta Hauler', type: 'Medium Truck', status: 'active', lat: 22.9734, lng: 72.6322, speed: 58, fuel: 45, driver: 'Sarah Johnson', destination: 'Distribution B', eta: '15:45', alerts: [] },
  { id: 'VH-003', name: 'Gamma Express', type: 'Light Van', status: 'maintenance', lat: 23.0617, lng: 72.5824, speed: 0, fuel: 92, driver: 'Mike Wilson', destination: 'Service Center', eta: 'N/A', alerts: ['Maintenance Required'] },
  { id: 'VH-004', name: 'Delta Logistics', type: 'Heavy Truck', status: 'active', lat: 23.0395, lng: 72.5502, speed: 72, fuel: 62, driver: 'Emily Davis', destination: 'Port Terminal', eta: '16:20', alerts: ['Traffic Delay'] },
];

const STATUS_COLORS = {
  active: '#10b981',
  maintenance: '#f59e0b',
  idle: '#6b7280',
  alert: '#ef4444',
};

const createVehicleIcon = (vehicle) => {
  const color = STATUS_COLORS[vehicle.status] || '#6b7280';
  const hasAlert = vehicle.alerts.length > 0;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
        ${hasAlert ? `<circle cx="28" cy="6" r="7" fill="#ef4444" stroke="white" stroke-width="1.5"><animate attributeName="r" values="6;8;6" dur="1.2s" repeatCount="indefinite"/></circle>` : ''}
        <circle cx="18" cy="18" r="14" fill="${color}" stroke="white" stroke-width="2.5" opacity="0.95"/>
        <circle cx="18" cy="18" r="10" fill="${color}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        <polygon points="18,8 13,26 18,22 23,26" fill="white" opacity="0.9"/>
        <line x1="18" y1="32" x2="18" y2="44" stroke="${color}" stroke-width="2" opacity="0.6"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
};

const FleetMap = ({ compact = false, fullScreen = false }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { vehicles: storeVehicles } = useFleetStore();

  const height = fullScreen ? 'calc(100vh - 130px)' : compact ? '260px' : '520px';

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [23.0225, 72.5714],
      zoom: 13,
      zoomControl: true,
      attributionControl: false,
    });

    // OpenStreetMap tiles (free, looks exactly like Google Maps)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Add vehicle markers
    fleetVehicles.forEach((vehicle) => {
      const marker = L.marker([vehicle.lat, vehicle.lng], {
        icon: createVehicleIcon(vehicle),
      }).addTo(map);

      marker.on('click', () => setSelectedVehicle(vehicle));

      markersRef.current.push(marker);
    });

    // Fit map to all vehicles
    const bounds = L.latLngBounds(fleetVehicles.map(v => [v.lat, v.lng]));
    map.fitBounds(bounds, { padding: [50, 50] });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Invalidate size on resize
  useEffect(() => {
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [fullScreen, compact]);

  const fuelColor = (fuel) => fuel > 60 ? '#10b981' : fuel > 30 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Leaflet map container */}
      <div ref={mapRef} className="w-full h-full" style={{ zIndex: 1 }} />

      {/* Live badge overlay */}
      <div className="absolute top-3 right-3 z-[999] flex items-center gap-1.5 bg-black/70 border border-emerald-500/40 rounded-lg px-2.5 py-1.5 backdrop-blur-sm pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <Signal size={12} className="text-emerald-400" />
        <span className="text-[10px] font-mono text-emerald-400 tracking-widest">LIVE</span>
      </div>

      {/* Fleet status legend */}
      {!compact && (
        <div className="absolute bottom-6 left-3 z-[999] bg-black/70 border border-white/10 rounded-xl p-3 backdrop-blur-sm pointer-events-none">
          <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-2">Fleet Status</p>
          {[
            { color: '#10b981', label: 'Active' },
            { color: '#f59e0b', label: 'Maintenance' },
            { color: '#ef4444', label: 'Alert' },
            { color: '#6b7280', label: 'Idle' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 mb-1 last:mb-0">
              <div className="w-2.5 h-2.5 rounded-full border border-white/30" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-gray-300">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Vehicle detail panel */}
      {selectedVehicle && !compact && (
        <div className="absolute top-3 left-3 z-[999] bg-black/85 border border-white/10 rounded-2xl p-4 min-w-[220px] backdrop-blur-sm shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[selectedVehicle.status] }} />
              <span className="font-mono text-sm font-bold text-white">{selectedVehicle.id}</span>
            </div>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-white font-bold text-sm mb-0.5">{selectedVehicle.name}</p>
          <p className="text-gray-400 text-xs mb-3">{selectedVehicle.type}</p>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Driver</span>
              <span className="text-white font-medium">{selectedVehicle.driver}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Speed</span>
              <span className="text-white font-mono">{selectedVehicle.speed} mph</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Fuel</span>
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${selectedVehicle.fuel}%`, backgroundColor: fuelColor(selectedVehicle.fuel) }}
                  />
                </div>
                <span
                  className="font-mono"
                  style={{ color: fuelColor(selectedVehicle.fuel) }}
                >
                  {selectedVehicle.fuel}%
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Destination</span>
              <span className="text-white font-medium text-right max-w-[100px]">{selectedVehicle.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">ETA</span>
              <span className="text-emerald-400 font-mono">{selectedVehicle.eta}</span>
            </div>
          </div>

          {selectedVehicle.alerts.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              {selectedVehicle.alerts.map((alert, i) => (
                <div key={i} className="flex items-center gap-1.5 text-red-400 text-xs">
                  <AlertTriangle size={11} />
                  {alert}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fleet count badge */}
      <div className="absolute bottom-6 right-3 z-[999] bg-black/70 border border-white/10 rounded-lg px-3 py-2 backdrop-blur-sm pointer-events-none flex items-center gap-2">
        <Users size={13} className="text-gray-400" />
        <span className="text-xs text-gray-300 font-mono">{fleetVehicles.filter(v => v.status === 'active').length} / {fleetVehicles.length} active</span>
      </div>
    </div>
  );
};

export default FleetMap;
