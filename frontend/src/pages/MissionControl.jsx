import React, { useState, useMemo } from 'react';
import {
    Truck, MapPin, Navigation, Users, Activity, Clock,
    ShieldAlert, Radar, Target, Zap, AlertTriangle,
    Play, Pause, CheckCircle, XCircle, Search, Plus,
    Send, ChevronDown
} from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import StatusBadge from '../components/StatusBadge';
import FleetMap from '../components/FleetMap';
import AccessRestricted from '../components/AccessRestricted';

const MissionControl = () => {
    const { trips, vehicles, drivers, addTrip, currentUser } = useFleetStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedMission, setSelectedMission] = useState(null);
    const [showDispatch, setShowDispatch] = useState(false);
    const [broadcastSent, setBroadcastSent] = useState(false);

    const [dispatchForm, setDispatchForm] = useState({
        vehicle: '', driver: '', origin: '', destination: '', priority: 'Normal'
    });

    // RBAC check
    const hasAccess = ['Administrator', 'Fleet Manager', 'Dispatcher'].includes(currentUser?.role);
    if (!hasAccess) return <AccessRestricted />;

    // Sample mission data if trips is empty
    const sampleMissions = [
        { id: 'M001', status: 'In Progress', vehicle: 'VH-001 - Alpha Transport', driver: 'John Smith', origin: 'Warehouse A', destination: 'Port Terminal', priority: 'High', timestamp: '2 mins ago', distance: '45 km' },
        { id: 'M002', status: 'Completed', vehicle: 'VH-002 - Beta Hauler', driver: 'Sarah Johnson', origin: 'Distribution Center B', destination: 'Airport', priority: 'Normal', timestamp: '1 hour ago', distance: '32 km' },
        { id: 'M003', status: 'Pending', vehicle: 'VH-003 - Gamma Express', driver: 'Mike Wilson', origin: 'Factory Complex', destination: 'Rail Yard', priority: 'Medium', timestamp: '30 mins ago', distance: '28 km' }
    ];

    const missionsData = trips && trips.length > 0 ? trips : sampleMissions;

    const missionStats = useMemo(() => {
        const data = missionsData || [];
        return {
            total: data.length,
            active: data.filter(t => t.status === 'In Progress' || t.status === 'On Trip').length,
            completed: data.filter(t => t.status === 'Completed').length,
            pending: data.filter(t => t.status === 'Pending' || t.status === 'Draft').length,
            successRate: data.length > 0 ? Math.round((data.filter(t => t.status === 'Completed').length / data.length) * 100) : 0
        };
    }, [missionsData]);

    const filteredMissions = useMemo(() => {
        if (!missionsData) return [];
        return missionsData.filter(mission => {
            const matchesSearch =
                mission.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mission.vehicle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mission.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mission.destination?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || mission.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [missionsData, searchTerm, statusFilter]);

    const handleDispatch = (e) => {
        e.preventDefault();
        if (!dispatchForm.vehicle || !dispatchForm.destination) return;
        addTrip({
            vehiclePlate: dispatchForm.vehicle,
            driverName: dispatchForm.driver,
            origin: dispatchForm.origin,
            destination: dispatchForm.destination,
            priority: dispatchForm.priority,
            vehicle: dispatchForm.vehicle,
            driver: dispatchForm.driver,
        });
        setDispatchForm({ vehicle: '', driver: '', origin: '', destination: '', priority: 'Normal' });
        setShowDispatch(false);
    };

    const handleEmergencyBroadcast = () => {
        setBroadcastSent(true);
        setTimeout(() => setBroadcastSent(false), 3000);
    };

    const MissionCard = ({ mission }) => (
        <div
            className="card-elevated p-5 hover:shadow-xl transition-all duration-300 border-l-4 cursor-pointer group"
            style={{ borderLeftColor: mission.status === 'Completed' ? '#10b981' : mission.status === 'In Progress' || mission.status === 'On Trip' ? '#6366f1' : '#f59e0b' }}
            onClick={() => setSelectedMission(mission)}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${mission.status === 'Completed' ? 'bg-success/20 text-success' :
                            mission.status === 'In Progress' || mission.status === 'On Trip' ? 'bg-primary/20 text-primary' :
                                'bg-warning/20 text-warning'
                        }`}>
                        {mission.status === 'Completed' ? <CheckCircle size={18} /> :
                            mission.status === 'In Progress' || mission.status === 'On Trip' ? <Play size={18} /> :
                                <Clock size={18} />}
                    </div>
                    <div>
                        <h3 className="font-bold text-text-primary">Mission #{mission.id}</h3>
                        <StatusBadge status={mission.status} />
                    </div>
                </div>
                <span className="text-xs text-text-muted flex items-center gap-1">
                    <Clock size={11} />
                    {mission.timestamp || 'Just now'}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="flex items-center gap-2">
                    <Truck size={14} className="text-primary flex-shrink-0" />
                    <div>
                        <p className="text-[9px] text-text-muted uppercase tracking-wider">Vehicle</p>
                        <p className="text-xs font-semibold text-text-primary truncate">{mission.vehicle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Users size={14} className="text-accent flex-shrink-0" />
                    <div>
                        <p className="text-[9px] text-text-muted uppercase tracking-wider">Operator</p>
                        <p className="text-xs font-semibold text-text-primary">{mission.driver}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Target size={14} className="text-warning flex-shrink-0" />
                    <div>
                        <p className="text-[9px] text-text-muted uppercase tracking-wider">Priority</p>
                        <p className="text-xs font-semibold text-text-primary">{mission.priority || 'Normal'}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-text-primary">
                    <MapPin size={12} className="text-primary" />
                    <span className="text-text-muted">{mission.origin}</span>
                    <Navigation size={12} className="text-text-muted" />
                    <span>{mission.destination}</span>
                </div>
                <span className="text-[10px] text-text-muted font-mono">{mission.distance || '—'}</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-text-primary tracking-tight flex items-center gap-3">
                        <Radar className="text-primary" size={32} />
                        Mission Control Center
                    </h1>
                    <p className="text-text-muted mt-1">Real-time fleet operations and mission management</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-surface-elevated rounded-lg border border-border">
                        <Activity size={16} className="text-primary animate-pulse" />
                        <span className="text-sm font-semibold text-text-primary">{missionStats.active} Active</span>
                    </div>
                    <button
                        onClick={() => setShowDispatch(true)}
                        className="btn-primary py-2.5 px-5 flex items-center gap-2"
                    >
                        <Zap size={16} />
                        Launch Mission
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Missions', value: missionStats.total, icon: Target, color: 'primary' },
                    { label: 'In Progress', value: missionStats.active, icon: Play, color: 'success' },
                    { label: 'Completed', value: missionStats.completed, icon: CheckCircle, color: 'accent' },
                    { label: 'Success Rate', value: `${missionStats.successRate}%`, icon: ShieldAlert, color: 'warning' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="card-elevated p-5 text-center">
                        <div className={`w-10 h-10 bg-${color}/10 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                            <Icon size={20} className={`text-${color}`} />
                        </div>
                        <p className="text-2xl font-black text-text-primary">{value}</p>
                        <p className="text-xs text-text-muted">{label}</p>
                    </div>
                ))}
            </div>

            {/* Control Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mission List */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Search + Filter Bar */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search missions, vehicles, operators..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-9 pr-4"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="input-field appearance-none pr-8 cursor-pointer"
                            >
                                <option value="All">All Status</option>
                                <option value="In Progress">In Progress</option>
                                <option value="On Trip">On Trip</option>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>
                    </div>

                    {/* Mission Cards */}
                    <div className="space-y-3">
                        {filteredMissions.length > 0 ? (
                            filteredMissions.map(mission => (
                                <MissionCard key={mission.id} mission={mission} />
                            ))
                        ) : (
                            <div className="card-elevated p-10 text-center">
                                <Radar size={40} className="text-text-muted mx-auto mb-3 opacity-40" />
                                <p className="text-text-muted">No missions match your search</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel */}
                <div className="space-y-4">
                    {/* Live Fleet Map (compact) */}
                    <div className="card-elevated p-5">
                        <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                            <Navigation size={16} className="text-primary" />
                            Live Fleet Map
                        </h3>
                        <div className="h-64 rounded-xl overflow-hidden">
                            <FleetMap compact={true} />
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1">
                                <Radar size={12} />
                                Track All
                            </button>
                            <button className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1">
                                <AlertTriangle size={12} />
                                Alerts
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card-elevated p-5">
                        <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                            <Zap size={16} className="text-primary" />
                            Quick Actions
                        </h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => setShowDispatch(true)}
                                className="w-full btn-primary py-2.5 px-4 flex items-center justify-center gap-2 text-sm"
                            >
                                <Plus size={16} />
                                New Mission
                            </button>
                            <button
                                onClick={() => setStatusFilter('Pending')}
                                className="w-full btn-secondary py-2.5 px-4 flex items-center justify-center gap-2 text-sm"
                            >
                                <Pause size={16} />
                                View Pending
                            </button>
                            <button
                                onClick={handleEmergencyBroadcast}
                                className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm border transition-all ${broadcastSent
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                        : 'bg-danger/10 text-danger border-danger/20 hover:bg-danger/20'
                                    }`}
                            >
                                <AlertTriangle size={16} />
                                {broadcastSent ? 'Broadcast Sent ✓' : 'Emergency Broadcast'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Detail Modal */}
            {selectedMission && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-surface-elevated rounded-2xl border border-border max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                                    <Target size={20} className="text-primary" />
                                    Mission #{selectedMission.id} Details
                                </h3>
                                <button onClick={() => setSelectedMission(null)} className="text-text-muted hover:text-text-primary transition-colors">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wider text-text-muted">Mission Info</h4>
                                    <div className="space-y-2">
                                        {[
                                            ['Status', <StatusBadge status={selectedMission.status} />],
                                            ['Vehicle', selectedMission.vehicle],
                                            ['Operator', selectedMission.driver],
                                            ['Priority', selectedMission.priority || 'Normal'],
                                        ].map(([label, val]) => (
                                            <div key={label} className="flex justify-between">
                                                <span className="text-sm text-text-muted">{label}:</span>
                                                <span className="font-semibold text-text-primary text-sm">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wider text-text-muted">Route Info</h4>
                                    <div className="space-y-2">
                                        {[
                                            ['Origin', selectedMission.origin],
                                            ['Destination', selectedMission.destination],
                                            ['Distance', selectedMission.distance || 'TBD'],
                                            ['Started', selectedMission.timestamp || 'Now'],
                                        ].map(([label, val]) => (
                                            <div key={label} className="flex justify-between">
                                                <span className="text-sm text-text-muted">{label}:</span>
                                                <span className="font-semibold text-text-primary text-sm">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {selectedMission.status === 'Pending' && (
                                    <button className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm">
                                        <Play size={16} />
                                        Start Mission
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedMission(null)}
                                    className="btn-secondary py-2.5 px-5 text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Dispatch Modal */}
            {showDispatch && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-surface-elevated rounded-2xl border border-border w-full max-w-lg shadow-2xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                                    <Send size={20} className="text-primary" />
                                    Dispatch New Mission
                                </h3>
                                <button onClick={() => setShowDispatch(false)} className="text-text-muted hover:text-text-primary">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleDispatch} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Vehicle</label>
                                        <select
                                            className="input-field"
                                            value={dispatchForm.vehicle}
                                            onChange={e => setDispatchForm({ ...dispatchForm, vehicle: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Vehicle</option>
                                            {vehicles.filter(v => v.status === 'Available').map(v => (
                                                <option key={v.id} value={v.plate || v.id}>{v.name || v.id} — {v.plate}</option>
                                            ))}
                                            <option value="VH-001">VH-001 — Alpha Transport</option>
                                            <option value="VH-004">VH-004 — Delta Logistics</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Driver</label>
                                        <select
                                            className="input-field"
                                            value={dispatchForm.driver}
                                            onChange={e => setDispatchForm({ ...dispatchForm, driver: e.target.value })}
                                        >
                                            <option value="">Select Driver</option>
                                            {drivers.filter(d => d.status === 'Available').map(d => (
                                                <option key={d.id} value={d.name}>{d.name}</option>
                                            ))}
                                            <option value="John Smith">John Smith</option>
                                            <option value="Emily Davis">Emily Davis</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Origin</label>
                                    <input
                                        className="input-field"
                                        placeholder="Pickup location"
                                        value={dispatchForm.origin}
                                        onChange={e => setDispatchForm({ ...dispatchForm, origin: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Destination *</label>
                                    <input
                                        className="input-field"
                                        placeholder="Drop-off location"
                                        required
                                        value={dispatchForm.destination}
                                        onChange={e => setDispatchForm({ ...dispatchForm, destination: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 block">Priority</label>
                                    <select
                                        className="input-field"
                                        value={dispatchForm.priority}
                                        onChange={e => setDispatchForm({ ...dispatchForm, priority: e.target.value })}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Normal">Normal</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="submit" className="flex-1 btn-primary py-3 flex items-center justify-center gap-2">
                                        <Send size={16} />
                                        Dispatch Now
                                    </button>
                                    <button type="button" onClick={() => setShowDispatch(false)} className="btn-secondary py-3 px-5">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MissionControl;
