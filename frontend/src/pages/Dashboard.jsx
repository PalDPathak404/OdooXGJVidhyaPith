import React, { useState, useMemo } from 'react';
import {
    Truck,
    AlertTriangle,
    Package,
    Plus,
    Filter,
    ArrowUpDown,
    Search,
    ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useFleetStore from '../store/fleetStore';
import KPIWidget from '../components/KPIWidget';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import SideDrawer from '../components/SideDrawer';

const Dashboard = () => {
    const navigate = useNavigate();
    const { vehicles, trips, currentUser } = useFleetStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [isTripDrawerOpen, setIsTripDrawerOpen] = useState(false);

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

    const columns = ['Trip ID', 'Vehicle', 'Driver', 'Status'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Search & Filters */}
            <div className="flex flex-col xl:flex-row gap-4 items-center justify-between mb-8">
                <div className="relative group w-full xl:w-1/3">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-olive transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search trips, vehicles, or drivers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white border border-border/40 rounded-3xl shadow-soft focus:outline-none focus:ring-2 focus:ring-olive/10 transition-all font-medium placeholder:text-gray-400"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full sm:w-auto appearance-none pl-12 pr-10 py-4 bg-white border border-border/40 rounded-2xl shadow-soft font-bold text-softblack hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-olive/10 cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="vehicle">By Vehicle</option>
                        </select>
                        <ArrowUpDown size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="relative flex-1 sm:flex-none">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-auto appearance-none pl-12 pr-10 py-4 bg-white border border-border/40 rounded-2xl shadow-soft font-bold text-softblack hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-olive/10 cursor-pointer"
                        >
                            <option value="All">All Statuses</option>
                            <option value="On Trip">On Trip</option>
                            <option value="Completed">Completed</option>
                            <option value="Draft">Draft</option>
                        </select>
                        <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <button className="flex-1 sm:flex-none btn-primary py-4 px-8 shadow-thick">
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
                    colorClass="text-olive"
                />
                <KPIWidget
                    title="Maintenance Alert"
                    value={maintenanceAlerts}
                    icon={AlertTriangle}
                    colorClass="text-rust"
                />
                <KPIWidget
                    title="Pending Cargo"
                    value={pendingCargo}
                    icon={Package}
                    colorClass="text-maroon"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4 mt-8">
                <h3 className="text-xl font-black text-softblack">Recent Trip Logs</h3>
                <div className="flex gap-4">
                    {['Administrator', 'Fleet Manager', 'Dispatcher'].includes(currentUser?.role) && (
                        <button
                            onClick={() => setIsTripDrawerOpen(true)}
                            className="flex items-center gap-2 px-6 py-4 bg-white text-softblack font-bold rounded-2xl border border-border/40 shadow-soft hover:shadow-thick transition-all active:scale-95"
                        >
                            <Plus size={20} className="text-olive" />
                            Dispatch Trip
                        </button>
                    )}
                    {['Administrator', 'Fleet Manager', 'Dispatcher', 'Safety Officer'].includes(currentUser?.role) && (
                        <button
                            onClick={() => navigate('/vehicles')}
                            className="btn-primary flex items-center gap-2 shadow-thick"
                        >
                            <Plus size={20} />
                            Register Vehicle
                        </button>
                    )}
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-4xl shadow-soft border border-border/30 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={filteredTrips}
                    renderRow={(trip) => (
                        <>
                            <td className="px-8 py-5 text-sm font-black text-softblack">#{trip.id.toUpperCase()}</td>
                            <td className="px-8 py-5 text-sm font-bold text-gray-500">{trip.vehicle}</td>
                            <td className="px-8 py-5 text-sm font-black text-softblack">{trip.driver}</td>
                            <td className="px-8 py-5 text-sm">
                                <StatusBadge status={trip.status} />
                            </td>
                        </>
                    )}
                />
            </div>

            <SideDrawer isOpen={isTripDrawerOpen} onClose={() => setIsTripDrawerOpen(false)} title="Dispatch New Trip">
                <div className="space-y-6 text-center py-10">
                    <div className="w-24 h-24 bg-olive/10 text-olive rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-olive/20">
                        <Truck size={48} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-softblack mb-2">Platform Synchronization</h4>
                        <p className="text-gray-400 font-medium px-4">The dedicated Trip Dispatching module is currently undergoing system calibration. Direct dispatches will be operational in the next launch phase.</p>
                    </div>
                    <div className="pt-6">
                        <button
                            onClick={() => setIsTripDrawerOpen(false)}
                            className="btn-primary w-full py-4 shadow-thick"
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
