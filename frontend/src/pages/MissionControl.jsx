import React, { useState, useMemo } from 'react';
import {
    Truck,
    MapPin,
    Navigation,
    Users,
    Activity,
    Clock,
    ShieldAlert,
    Radar,
    Target,
    Zap,
    AlertTriangle,
    Play,
    Pause,
    Square,
    CheckCircle,
    XCircle
} from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import FleetMap from '../components/FleetMap';
import CustomSelect from '../components/CustomSelect';
import AccessRestricted from '../components/AccessRestricted';

const MissionControl = () => {
    const { trips, vehicles, drivers, addTrip, currentUser } = useFleetStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedMission, setSelectedMission] = useState(null);
    const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);

    // RBAC check
    const hasAccess = ['Administrator', 'Fleet Manager', 'Dispatcher'].includes(currentUser?.role);
    if (!hasAccess) return <AccessRestricted />;

    // Mission statistics
    const missionStats = useMemo(() => ({
        total: trips.length,
        active: trips.filter(t => t.status === 'In Progress').length,
        completed: trips.filter(t => t.status === 'Completed').length,
        pending: trips.filter(t => t.status === 'Pending').length,
        successRate: trips.length > 0 ? Math.round((trips.filter(t => t.status === 'Completed').length / trips.length) * 100) : 0
    }), [trips]);

    const filteredMissions = useMemo(() => {
        return trips.filter(mission =>
            mission.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mission.vehicle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mission.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mission.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (statusFilter === 'All' || mission.status === statusFilter)
        );
    }, [trips, searchTerm, statusFilter]);

    const MissionCard = ({ mission }) => (
        <div className="card-elevated p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-l-transparent hover:border-primary group cursor-pointer"
             onClick={() => setSelectedMission(mission)}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        mission.status === 'Completed' ? 'bg-success/20 text-success' :
                        mission.status === 'In Progress' ? 'bg-primary/20 text-primary' :
                        mission.status === 'Pending' ? 'bg-warning/20 text-warning' :
                        'bg-text-muted/20 text-text-muted'
                    }`}>
                        {mission.status === 'Completed' ? <CheckCircle size={20} /> :
                         mission.status === 'In Progress' ? <Play size={20} /> :
                         mission.status === 'Pending' ? <Clock size={20} /> :
                         <Square size={20} />}
                    </div>
                    <div>
                        <h3 className="font-bold text-text-primary text-lg">Mission #{mission.id}</h3>
                        <StatusBadge status={mission.status} />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Clock size={14} />
                    <span>{mission.timestamp || 'Just now'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                    <Truck size={16} className="text-primary" />
                    <div>
                        <p className="text-xs text-text-muted">Vehicle</p>
                        <p className="font-semibold text-text-primary">{mission.vehicle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Users size={16} className="text-accent" />
                    <div>
                        <p className="text-xs text-text-muted">Operator</p>
                        <p className="font-semibold text-text-primary">{mission.driver || 'Auto-assigned'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Target size={16} className="text-warning" />
                    <div>
                        <p className="text-xs text-text-muted">Priority</p>
                        <p className="font-semibold text-text-primary">{mission.priority || 'Normal'}</p>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-primary" />
                        <span className="text-sm text-text-primary">{mission.origin}</span>
                        <Navigation size={14} className="text-text-muted mx-2" />
                        <span className="text-sm text-text-primary">{mission.destination}</span>
                    </div>
                    <button className="btn-primary py-2 px-4 text-sm">
                        Track Mission
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Mission Control Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-text-primary tracking-tight flex items-center gap-3">
                        <Radar className="text-primary" size={32} />
                        Mission Control Center
                    </h1>
                    <p className="text-text-muted mt-2">Real-time fleet operations and mission management</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-surface-elevated rounded-lg border border-border">
                        <Activity size={16} className="text-primary" />
                        <span className="text-sm font-semibold text-text-primary">{missionStats.active} Active</span>
                    </div>
                    <button className="btn-primary py-3 px-6 flex items-center gap-2 shadow-lg">
                        <Zap size={18} />
                        Launch New Mission
                    </button>
                </div>
            </div>

            {/* Mission Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="card-elevated p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Target size={24} className="text-primary" />
                    </div>
                    <p className="text-2xl font-black text-text-primary">{missionStats.total}</p>
                    <p className="text-xs text-text-muted">Total Missions</p>
                </div>
                <div className="card-elevated p-6 text-center">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Play size={24} className="text-success" />
                    </div>
                    <p className="text-2xl font-black text-text-primary">{missionStats.active}</p>
                    <p className="text-xs text-text-muted">In Progress</p>
                </div>
                <div className="card-elevated p-6 text-center">
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <CheckCircle size={24} className="text-warning" />
                    </div>
                    <p className="text-2xl font-black text-text-primary">{missionStats.completed}</p>
                    <p className="text-xs text-text-muted">Completed</p>
                </div>
                <div className="card-elevated p-6 text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <ShieldAlert size={24} className="text-accent" />
                    </div>
                    <p className="text-2xl font-black text-text-primary">{missionStats.successRate}%</p>
                    <p className="text-xs text-text-muted">Success Rate</p>
                </div>
            </div>

            {/* Control Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mission List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                            <Activity size={20} className="text-primary" />
                            Active Missions
                        </h2>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Search missions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary placeholder:text-text-muted"
                            />
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredMissions.map(mission => (
                            <MissionCard key={mission.id} mission={mission} />
                        ))}
                    </div>
                </div>

                {/* Live Map & Controls */}
                <div className="space-y-4">
                    <div className="card-elevated p-6">
                        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                            <Navigation size={18} className="text-primary" />
                            Live Fleet Map
                        </h3>
                        <div className="h-96 bg-surface rounded-xl border border-border overflow-hidden relative">
                            <FleetMap />
                            <div className="absolute top-4 left-4 z-10 space-y-2">
                                <button className="btn-primary py-2 px-4 text-xs shadow-lg flex items-center gap-2">
                                    <Radar size={14} />
                                    Track All
                                </button>
                                <button className="btn-secondary py-2 px-4 text-xs flex items-center gap-2">
                                    <AlertTriangle size={14} />
                                    Alerts Only
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card-elevated p-6">
                        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                            <Zap size={18} className="text-primary" />
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full btn-primary py-3 px-4 flex items-center justify-center gap-2">
                                <Play size={18} />
                                Start All Active Missions
                            </button>
                            <button className="w-full btn-secondary py-3 px-4 flex items-center justify-center gap-2">
                                <Pause size={18} />
                                Hold Emergency Missions
                            </button>
                            <button className="w-full bg-danger/10 text-danger border border-danger/20 py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-danger/20 transition-colors">
                                <AlertTriangle size={18} />
                                Emergency Broadcast
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Detail Modal */}
            {selectedMission && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-elevated rounded-2xl border border-border max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                                    <Target size={20} className="text-primary" />
                                    Mission #{selectedMission.id} Details
                                </h3>
                                <button 
                                    onClick={() => setSelectedMission(null)}
                                    className="text-text-muted hover:text-text-primary transition-colors"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-text-primary mb-2">Mission Information</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Status:</span>
                                            <StatusBadge status={selectedMission.status} />
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Vehicle:</span>
                                            <span className="font-semibold text-text-primary">{selectedMission.vehicle}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Operator:</span>
                                            <span className="font-semibold text-text-primary">{selectedMission.driver}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Priority:</span>
                                            <span className="font-semibold text-text-primary">{selectedMission.priority || 'Normal'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-text-primary mb-2">Route Information</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Origin:</span>
                                            <span className="font-semibold text-text-primary">{selectedMission.origin}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Destination:</span>
                                            <span className="font-semibold text-text-primary">{selectedMission.destination}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Distance:</span>
                                            <span className="font-semibold text-text-primary">{selectedMission.distance || 'TBD'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-6">
                                <button className="btn-primary py-3 px-6 flex items-center gap-2">
                                    <Play size={18} />
                                    Start Mission
                                </button>
                                <button className="btn-secondary py-3 px-6">
                                    Edit Details
                                </button>
                                <button 
                                    onClick={() => setSelectedMission(null)}
                                    className="btn-secondary py-3 px-6"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MissionControl;
