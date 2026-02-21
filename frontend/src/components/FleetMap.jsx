import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, AlertTriangle, Users, Fuel } from 'lucide-react';

const FleetMap = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [zoom, setZoom] = useState(10);

  // Sample fleet data
  const [fleetVehicles] = useState([
    {
      id: 'VH-001',
      name: 'Alpha Transport',
      type: 'Heavy Truck',
      status: 'active',
      position: { lat: 40.7589, lng: -73.9851 },
      speed: 65,
      heading: 45,
      fuel: 78,
      driver: 'John Smith',
      destination: 'Warehouse A',
      eta: '14:30',
      alerts: []
    },
    {
      id: 'VH-002',
      name: 'Beta Hauler',
      type: 'Medium Truck',
      status: 'active',
      position: { lat: 40.6892, lng: -74.0445 },
      speed: 58,
      heading: 180,
      fuel: 45,
      driver: 'Sarah Johnson',
      destination: 'Distribution Center B',
      eta: '15:45',
      alerts: []
    },
    {
      id: 'VH-003',
      name: 'Gamma Express',
      type: 'Light Van',
      status: 'maintenance',
      position: { lat: 40.7282, lng: -73.9942 },
      speed: 0,
      heading: 0,
      fuel: 92,
      driver: 'Mike Wilson',
      destination: 'Service Center',
      eta: 'N/A',
      alerts: ['Maintenance Required']
    },
    {
      id: 'VH-004',
      name: 'Delta Logistics',
      type: 'Heavy Truck',
      status: 'active',
      position: { lat: 40.7489, lng: -73.9680 },
      speed: 72,
      heading: 90,
      fuel: 62,
      driver: 'Emily Davis',
      destination: 'Port Terminal',
      eta: '16:20',
      alerts: ['Traffic Delay']
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--color-primary)';
      case 'maintenance': return 'var(--color-warning)';
      case 'idle': return 'var(--color-text-muted)';
      case 'alert': return 'var(--color-danger)';
      default: return 'var(--color-text-muted)';
    }
  };

  const VehicleMarker = ({ vehicle }) => (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{
        left: `${((vehicle.position.lng - mapCenter.lng + 0.5) * 200) + 400}px`,
        top: `${((mapCenter.lat - vehicle.position.lat + 0.5) * 200) + 200}px`
      }}
      onClick={() => setSelectedVehicle(vehicle)}
    >
      <div className="relative">
        <div
          className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
          style={{ backgroundColor: getStatusColor(vehicle.status) }}
        >
          <Navigation
            size={16}
            className="text-white"
            style={{
              transform: `rotate(${vehicle.heading}deg)`
            }}
          />
        </div>
        {vehicle.alerts.length > 0 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full border-2 border-white animate-pulse"></div>
        )}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-surface-elevated px-2 py-1 rounded text-xs font-mono whitespace-nowrap border border-border">
          {vehicle.id}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6 bg-surface rounded-xl">
      {/* Map Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-text-primary flex items-center gap-3">
          <MapPin className="text-primary" size={24} />
          Live Fleet Tracking
        </h3>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-sm">
            <Clock size={16} className="mr-2" />
            Last 24h
          </button>
          <button className="btn-secondary text-sm">
            <AlertTriangle size={16} className="mr-2" />
            Alerts Only
          </button>
          <button className="btn-primary text-sm">
            Refresh Map
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="card-elevated p-6 h-[600px] relative overflow-hidden bg-surface-elevated border border-border/30">
            {/* Simulated Map Background - Hardened visibility */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="grid grid-cols-12 grid-rows-12 h-full">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-border/40 relative">
                    {i % 13 === 0 && <div className="absolute inset-0 bg-primary/2" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Pulsing Scan Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none animate-pulse" />

            {/* Vehicle Markers */}
            {fleetVehicles.map(vehicle => (
              <VehicleMarker key={vehicle.id} vehicle={vehicle} />
            ))}

            {/* Map Legend */}
            <div className="absolute top-4 left-4 bg-surface-elevated p-3 rounded-lg border border-border">
              <h4 className="text-sm font-bold text-text-primary mb-2">Fleet Status</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="text-xs text-text-secondary">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <span className="text-xs text-text-secondary">Maintenance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-text-muted"></div>
                  <span className="text-xs text-text-secondary">Idle</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-danger"></div>
                  <span className="text-xs text-text-secondary">Alert</span>
                </div>
              </div>
            </div>

            {/* Scale Indicator */}
            <div className="absolute bottom-4 right-4 bg-surface-elevated px-3 py-2 rounded-lg border border-border">
              <div className="text-xs text-text-muted">Scale: 1:10000</div>
            </div>
          </div>
        </div>

        {/* Vehicle Details Panel */}
        <div className="space-y-4">
          {/* Selected Vehicle Details */}
          {selectedVehicle ? (
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-text-primary">{selectedVehicle.name}</h4>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getStatusColor(selectedVehicle.status) }}
                ></div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Vehicle ID</span>
                  <span className="text-sm font-mono text-text-primary">{selectedVehicle.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Type</span>
                  <span className="text-sm text-text-primary">{selectedVehicle.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Driver</span>
                  <span className="text-sm text-text-primary">{selectedVehicle.driver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Speed</span>
                  <span className="text-sm font-mono text-text-primary">{selectedVehicle.speed} mph</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Fuel</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${selectedVehicle.fuel}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-mono text-text-primary">{selectedVehicle.fuel}%</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">Destination</span>
                  <span className="text-sm text-text-primary">{selectedVehicle.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-muted">ETA</span>
                  <span className="text-sm font-mono text-primary">{selectedVehicle.eta}</span>
                </div>
              </div>

              {selectedVehicle.alerts.length > 0 && (
                <div className="mt-4 p-3 bg-danger/20 rounded-lg border border-danger/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-danger" />
                    <span className="text-sm font-bold text-danger">Active Alerts</span>
                  </div>
                  {selectedVehicle.alerts.map((alert, index) => (
                    <div key={index} className="text-xs text-danger">{alert}</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card-elevated p-6 text-center">
              <MapPin size={48} className="text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">Select a vehicle to view details</p>
            </div>
          )}

          {/* Fleet Summary */}
          <div className="card-elevated p-6">
            <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <Users size={18} />
              Fleet Summary
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted">Total Vehicles</span>
                <span className="text-lg font-bold text-text-primary">{fleetVehicles.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted">Active</span>
                <span className="text-sm font-mono text-success">{fleetVehicles.filter(v => v.status === 'active').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted">In Maintenance</span>
                <span className="text-sm font-mono text-warning">{fleetVehicles.filter(v => v.status === 'maintenance').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted">Avg Fuel Level</span>
                <div className="flex items-center gap-2">
                  <Fuel size={14} className="text-text-muted" />
                  <span className="text-sm font-mono text-text-primary">
                    {Math.round(fleetVehicles.reduce((acc, v) => acc + v.fuel, 0) / fleetVehicles.length)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetMap;
