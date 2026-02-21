import React, { useState, useMemo } from 'react';
import {
    Wrench,
    Calendar,
    DollarSign,
    AlertCircle,
    Plus,
    Search,
    ChevronDown,
    Activity,
    Clock,
    Truck
} from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import SideDrawer from '../components/SideDrawer';
import AccessRestricted from '../components/AccessRestricted';

const FormInputField = ({ label, icon: Icon, value, onChange, placeholder, type = "text", error }) => (
    <div className="space-y-2">
        <label className="text-sm font-black text-softblack/60 ml-1">{label}</label>
        <div className="relative group">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-rust' : 'text-gray-400 group-focus-within:text-olive'}`}>
                <Icon size={18} />
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full pl-12 pr-6 py-4 bg-background border rounded-2xl focus:outline-none focus:ring-2 focus:bg-white transition-all text-softblack font-semibold placeholder:text-gray-400 ${error ? 'border-rust/50 focus:ring-rust/10' : 'border-border/40 focus:ring-olive/10'}`}
            />
        </div>
        {error && <span className="text-[10px] font-bold text-rust uppercase tracking-tighter ml-1">{error}</span>}
    </div>
);

const FormSelectField = ({ label, icon: Icon, value, onChange, options, error }) => (
    <div className="space-y-2">
        <label className="text-sm font-black text-softblack/60 ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-olive transition-colors z-10 pointer-events-none">
                <Icon size={18} />
            </div>
            <select
                value={value}
                onChange={onChange}
                className={`w-full pl-12 pr-10 py-4 bg-background border rounded-2xl focus:outline-none focus:ring-2 focus:bg-white transition-all text-softblack font-semibold appearance-none cursor-pointer ${error ? 'border-rust/50 focus:ring-rust/10' : 'border-border/40 focus:ring-olive/10'}`}
            >
                <option value="">Select Vehicle</option>
                {options.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name} ({opt.plate})</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
            </div>
        </div>
        {error && <span className="text-[10px] font-bold text-rust uppercase tracking-tighter ml-1">{error}</span>}
    </div>
);

const Maintenance = () => {
    const { maintenance, vehicles, addMaintenance, currentUser } = useFleetStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Auth Check
    const hasAccess = ['Administrator', 'Fleet Manager', 'Safety Officer'].includes(currentUser?.role);

    // Form State
    const [newLog, setNewLog] = useState({
        vehicleId: '',
        service: '',
        date: new Date().toISOString().split('T')[0],
        cost: '',
    });
    const [errors, setErrors] = useState({});

    const filteredMaintenance = useMemo(() => {
        return maintenance.filter(m =>
            (m.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (m.vehicle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (m.service?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
    }, [maintenance, searchTerm]);

    const handleCreateService = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!newLog.vehicleId) newErrors.vehicleId = "Required";
        if (!newLog.service) newErrors.service = "Required";
        if (!newLog.date) newErrors.date = "Required";
        if (!newLog.cost) newErrors.cost = "Required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const selectedVehicle = vehicles.find(v => v.id === newLog.vehicleId);

        addMaintenance({
            ...newLog,
            vehicle: selectedVehicle?.name || 'Unknown',
            status: 'Open'
        });

        setIsDrawerOpen(false);
        setNewLog({
            vehicleId: '',
            service: '',
            date: new Date().toISOString().split('T')[0],
            cost: '',
        });
        setErrors({});
    };

    if (!hasAccess) {
        return <AccessRestricted />;
    }

    const columns = ['Log ID', 'Vehicle', 'Issue/Service', 'Date', 'Cost', 'Status'];

    const renderRow = (log) => {
        const isVehicleInShop = vehicles.find(v => v.name === log.vehicle)?.status === 'In Shop';

        return (
            <>
                <td className="px-8 py-5">
                    <span className="font-black text-softblack">{log.id}</span>
                </td>
                <td className="px-8 py-5">
                    <div className="flex flex-col">
                        <span className={`font-bold ${isVehicleInShop ? 'text-rust' : 'text-softblack'}`}>
                            {log.vehicle}
                        </span>
                        {isVehicleInShop && (
                            <span className="text-[10px] font-black text-rust/60 uppercase tracking-widest">In Shop Now</span>
                        )}
                    </div>
                </td>
                <td className="px-8 py-5">
                    <span className="text-sm font-semibold text-softblack">{log.service}</span>
                </td>
                <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Clock size={14} />
                        <span className="text-xs font-bold">{log.date}</span>
                    </div>
                </td>
                <td className="px-8 py-5">
                    <span className="text-sm font-black text-softblack">₹{parseFloat(log.cost).toLocaleString()}</span>
                </td>
                <td className="px-8 py-5">
                    <StatusBadge status={log.status} />
                </td>
            </>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h3 className="text-2xl font-black text-softblack tracking-tight">Service Logs</h3>
                    <p className="text-gray-400 font-medium text-sm">Monitor fleet health and maintenance cycles</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group w-64">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-olive transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-white border border-border/40 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-olive/10 transition-all font-medium"
                        />
                    </div>
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="btn-primary py-3 px-6 font-black shadow-thick flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Create New Service
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-4xl shadow-thick border border-border/30 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={filteredMaintenance}
                    renderRow={renderRow}
                />
            </div>

            <SideDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Log New Service"
            >
                <form onSubmit={handleCreateService} className="space-y-6">
                    <FormSelectField
                        label="Select Target Vehicle"
                        icon={Truck}
                        value={newLog.vehicleId}
                        onChange={(e) => setNewLog({ ...newLog, vehicleId: e.target.value })}
                        options={vehicles}
                        error={errors.vehicleId}
                    />

                    <FormInputField
                        label="Issue or Service Description"
                        icon={Wrench}
                        placeholder="e.g. Engine Overhaul, Oil Change"
                        value={newLog.service}
                        onChange={(e) => setNewLog({ ...newLog, service: e.target.value })}
                        error={errors.service}
                    />

                    <div className="grid grid-cols-1 gap-6">
                        <FormInputField
                            label="Service Date"
                            icon={Calendar}
                            type="date"
                            value={newLog.date}
                            onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                            error={errors.date}
                        />
                        <FormInputField
                            label="Estimated Cost (₹)"
                            icon={DollarSign}
                            type="number"
                            placeholder="0.00"
                            value={newLog.cost}
                            onChange={(e) => setNewLog({ ...newLog, cost: e.target.value })}
                            error={errors.cost}
                        />
                    </div>

                    <div className="pt-6 border-t border-border/20 flex gap-4">
                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(false)}
                            className="flex-1 py-4 bg-background border border-border/40 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn-primary py-4 font-black shadow-thick"
                        >
                            Log Service Entry
                        </button>
                    </div>
                </form>
            </SideDrawer>
        </div>
    );
};

export default Maintenance;
