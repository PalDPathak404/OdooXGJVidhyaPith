import React, { useState, useMemo } from 'react';
import {
    Truck,
    AlertTriangle,
    Package,
    Plus,
    Filter,
    ArrowUpDown,
    Search,
    ChevronDown,
    Radar,
    Activity,
    MapPin,
    RefreshCw,
    BarChart3,
    Map
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useFleetStore from '../store/fleetStore';
import KPIWidget from '../components/KPIWidget';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import SideDrawer from '../components/SideDrawer';
import AccessRestricted from '../components/AccessRestricted';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import FleetMap from '../components/FleetMap';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { vehicles, trips, currentUser } = useFleetStore();
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [isTripDrawerOpen, setIsTripDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // RBAC check
    const hasAccess = ['Administrator', 'Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'].includes(currentUser?.role);
    if (!hasAccess) return <AccessRestricted />;

    // Calculated Stats
    const activeFleet = vehicles.filter(v => v.status === 'On Trip' || v.status === 'Available').length;
    const maintenanceAlerts = vehicles.filter(v => v.status === 'In Shop').length;
    const pendingCargo = trips.filter(t => t.status === 'Draft' || t.status === 'Pending').length;

    // Filtered & Sorted Trips
    const filteredTrips = useMemo(() => {
        let result = [...trips];

        // Search
        if (searchTerm) {
            result = result.filter(t =>
                (t.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (t.vehicle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (t.driver?.toLowerCase() || '').includes(searchTerm.toLowerCase())
            );
        }

        // Status Filter
        if (statusFilter !== 'All') {
            result = result.filter(t => t.status.toLowerCase() === statusFilter.toLowerCase());
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'newest') return b.id.localeCompare(a.id);
            if (sortBy === 'oldest') return a.id.localeCompare(b.id);
            if (sortBy === 'vehicle') return a.vehicle.localeCompare(b.vehicle);
            return 0;
        });

        return result;
    }, [trips, searchTerm, statusFilter, sortBy]);

    const columns = ['Mission ID', 'Asset', 'Operator', 'Status'];

    return (
        <div className="space-y-8">
            {/* Tab Navigation */}
            <div className="flex items-center gap-6 border-b border-border">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-4 px-2 font-medium transition-all border-b-2 ${
                        activeTab === 'overview'
                            ? 'text-primary border-primary'
                            : 'text-text-muted border-transparent hover:text-text-secondary'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Radar size={18} />
                        Overview
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`pb-4 px-2 font-medium transition-all border-b-2 ${
                        activeTab === 'analytics'
                            ? 'text-primary border-primary'
                            : 'text-text-muted border-transparent hover:text-text-secondary'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <BarChart3 size={18} />
                        Analytics
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('map')}
                    className={`pb-4 px-2 font-medium transition-all border-b-2 ${
                        activeTab === 'map'
                            ? 'text-primary border-primary'
                            : 'text-text-muted border-transparent hover:text-text-secondary'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Map size={18} />
                        Live Map
                    </div>
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <>
                    {/* Search & Filters */}
                    <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
                        <div className="relative group flex-1 xl:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search missions, assets, or operators..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-12 pr-4"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="input-field appearance-none pl-10 pr-10 cursor-pointer"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="vehicle">By Asset</option>
                                </select>
                                <ArrowUpDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                            </div>

                            <div className="relative flex-1 sm:flex-none">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="input-field appearance-none pl-10 pr-10 cursor-pointer"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="On Trip">On Mission</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Draft">Draft</option>
                                </select>
                                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                            </div>

                            <button className="btn-secondary flex items-center gap-2">
                                <RefreshCw size={18} />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* KPI Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <KPIWidget
                            title="Active Fleet"
                            value={activeFleet}
                            icon={Truck}
                            colorClass="text-primary"
                            trend="up"
                            subtitle="Assets operational"
                        />
                        <KPIWidget
                            title="Maintenance Alert"
                            value={maintenanceAlerts}
                            icon={AlertTriangle}
                            colorClass="text-warning"
                            trend="down"
                            subtitle="Service required"
                        />
                        <KPIWidget
                            title="Pending Cargo"
                            value={pendingCargo}
                            icon={Package}
                            colorClass="text-accent"
                            trend="up"
                            subtitle="Awaiting dispatch"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Radar className="text-primary" size={20} />
                            <h3 className="text-xl font-bold text-text-primary">Active Mission Logs</h3>
                            <div className="px-2 py-1 bg-primary/20 rounded-full">
                                <span className="text-xs text-primary font-mono font-semibold">LIVE</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {['Administrator', 'Fleet Manager', 'Dispatcher'].includes(currentUser?.role) && (
                                <button
                                    onClick={() => setIsTripDrawerOpen(true)}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <Plus size={18} className="text-primary" />
                                    Dispatch Mission
                                </button>
                            )}
                            {['Administrator', 'Fleet Manager', 'Dispatcher', 'Safety Officer'].includes(currentUser?.role) && (
                                <button
                                    onClick={() => navigate('/vehicles')}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <Plus size={18} />
                                    Register Asset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Main Table */}
                    <div className="card-elevated overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={filteredTrips}
                            renderRow={(trip) => (
                                <>
                                    <td className="font-mono text-sm font-bold text-text-primary">
                                        <span className="text-text-muted">#</span>{trip.id.toUpperCase()}
                                    </td>
                                    <td className="text-sm font-medium text-text-secondary">{trip.vehicle}</td>
                                    <td className="text-sm font-medium text-text-primary">{trip.driver}</td>
                                    <td className="text-sm">
                                        <StatusBadge status={trip.status} showIcon={true} />
                                    </td>
                                </>
                            )}
                        />
                    </div>
                </>
            )}

            {activeTab === 'analytics' && <AdvancedAnalytics key={theme} />}
            {activeTab === 'map' && <FleetMap />}

            <SideDrawer isOpen={isTripDrawerOpen} onClose={() => setIsTripDrawerOpen(false)} title="Dispatch New Mission">
                <div className="space-y-6 text-center py-10">
                    <div className="w-24 h-24 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
                        <MapPin size={48} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-text-primary mb-2">Mission Control System</h4>
                        <p className="text-text-secondary font-medium px-4">The dedicated Mission Dispatch module is currently undergoing system calibration. Direct mission deployment will be operational in the next launch phase.</p>
                    </div>
                    <div className="pt-6">
                        <button
                            onClick={() => setIsTripDrawerOpen(false)}
                            className="btn-primary w-full"
                        >
                            Acknowledge System Status
                        </button>
                    </div>
                </div>
            </SideDrawer>
        </div>
    );
};

export default Dashboard;
