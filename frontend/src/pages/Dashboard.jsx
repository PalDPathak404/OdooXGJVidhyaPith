import React from 'react';
import {
    Truck,
    AlertTriangle,
    Package,
    Plus,
    Filter,
    ArrowUpDown,
    Search
} from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import KPIWidget from '../components/KPIWidget';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
    const { vehicles, trips } = useFleetStore();

    const activeFleet = vehicles.filter(v => v.status === 'On Trip').length;
    const maintenanceAlerts = vehicles.filter(v => v.status === 'In Shop').length;
    const pendingCargo = trips.filter(t => t.status === 'Draft').length;

    const columns = ['Trip ID', 'Vehicle', 'Driver', 'Status'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-olive transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search trips, vehicles..."
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all font-medium"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-5 py-4 bg-white border border-gray-100 rounded-2xl shadow-soft font-bold text-softblack hover:bg-gray-50 transition-all">
                        <ArrowUpDown size={18} className="text-gray-400" />
                        Group by
                    </button>
                    <button className="flex items-center gap-2 px-5 py-4 bg-white border border-gray-100 rounded-2xl shadow-soft font-bold text-softblack hover:bg-gray-50 transition-all">
                        <Filter size={18} className="text-gray-400" />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-5 py-4 bg-white border border-gray-100 rounded-2xl shadow-soft font-bold text-softblack hover:bg-gray-50 transition-all">
                        Sort by
                    </button>
                </div>
            </div>

            {/* KPI Section */}
            <div className="flex flex-wrap gap-6">
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
            <div className="flex justify-end gap-4 mt-8">
                <button className="flex items-center gap-2 px-6 py-4 bg-white text-softblack font-bold rounded-2xl border border-gray-100 shadow-soft hover:bg-gray-50 transition-all">
                    <Plus size={20} className="text-olive" />
                    New Trip
                </button>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    New Vehicle
                </button>
            </div>

            {/* Main Table */}
            <div className="mt-4">
                <DataTable
                    columns={columns}
                    data={trips}
                    renderRow={(trip) => (
                        <>
                            <td className="px-8 py-5 text-sm font-bold text-softblack">#{trip.id.toUpperCase()}</td>
                            <td className="px-8 py-5 text-sm font-medium text-gray-500">{trip.vehicle}</td>
                            <td className="px-8 py-5 text-sm font-bold text-softblack">{trip.driver}</td>
                            <td className="px-8 py-5 text-sm">
                                <StatusBadge status={trip.status} />
                            </td>
                        </>
                    )}
                />
            </div>
        </div>
    );
};

export default Dashboard;
