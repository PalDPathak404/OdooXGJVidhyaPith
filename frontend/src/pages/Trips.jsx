import React, { useState, useMemo } from 'react';
import {
    Truck,
    MapPin,
    Weight,
    Fuel,
    User,
    Plus,
    Search,
    ChevronDown,
    Activity,
    Navigation,
    Clock,
    ShieldAlert
} from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import SideDrawer from '../components/SideDrawer';

const FormInputField = ({ label, icon: Icon, value, onChange, placeholder, type = "text", error, warning }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-black text-softblack/60">{label}</label>
            {error && <span className="text-[10px] font-bold text-rust uppercase tracking-tighter">{error}</span>}
            {warning && <span className="text-[10px] font-bold text-rust uppercase tracking-tighter">{warning}</span>}
        </div>
        <div className="relative group">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error || warning ? 'text-rust' : 'text-gray-400 group-focus-within:text-olive'}`}>
                <Icon size={18} />
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full pl-12 pr-6 py-4 bg-background border rounded-2xl focus:outline-none focus:ring-2 focus:bg-white transition-all text-softblack font-semibold placeholder:text-gray-400 ${error || warning ? 'border-rust/50 focus:ring-rust/10' : 'border-border/40 focus:ring-olive/10'}`}
            />
        </div>
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
                <option value="">Select Option</option>
                {options.map(opt => (
                    <option key={opt.id || opt} value={opt.value || opt}>{opt.label || opt}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
            </div>
        </div>
        {error && <span className="text-[10px] font-bold text-rust uppercase tracking-tighter ml-1">{error}</span>}
    </div>
);

const Trips = () => {
    const { trips, vehicles, drivers, addTrip, currentUser } = useFleetStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Form State
    const [newTrip, setNewTrip] = useState({
        vehiclePlate: '',
        driverName: '',
        origin: '',
        destination: '',
        cargoWeight: '',
        fuelCost: '',
        type: 'Standard Delivery'
    });
    const [errors, setErrors] = useState({});

    // Available Resources
    const availableVehicles = useMemo(() => vehicles.filter(v => v.status === 'Available'), [vehicles]);
    const availableDrivers = useMemo(() => drivers.filter(d => d.status === 'On Duty'), [drivers]);

    const selectedVehicle = useMemo(() =>
        vehicles.find(v => v.plate === newTrip.vehiclePlate), [vehicles, newTrip.vehiclePlate]
    );

    // Validation: Cargo Weight vs. Vehicle Capacity
    const weightWarning = useMemo(() => {
        if (!newTrip.cargoWeight || !selectedVehicle) return null;
        const cargo = parseFloat(newTrip.cargoWeight);
        const capacity = parseFloat(selectedVehicle.capacity);
        if (cargo > capacity) return `Exceeds Capacity (${selectedVehicle.capacity})`;
        return null;
    }, [newTrip.cargoWeight, selectedVehicle]);

    const filteredTrips = useMemo(() => {
        return trips.filter(t =>
            (t.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (t.vehicle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (t.origin?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (t.destination?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
    }, [trips, searchTerm]);

    const handleDispatch = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!newTrip.vehiclePlate) newErrors.vehiclePlate = "Required";
        if (!newTrip.driverName) newErrors.driverName = "Required";
        if (!newTrip.origin) newErrors.origin = "Required";
        if (!newTrip.destination) newErrors.destination = "Required";
        if (!newTrip.cargoWeight) newErrors.cargoWeight = "Required";

        if (Object.keys(newErrors).length > 0 || weightWarning) {
            setErrors(newErrors);
            return;
        }

        addTrip({
            ...newTrip,
            vehicle: selectedVehicle.name,
            driver: newTrip.driverName,
            status: 'On Trip'
        });

        // Reset
        setNewTrip({
            vehiclePlate: '',
            driverName: '',
            origin: '',
            destination: '',
            cargoWeight: '',
            fuelCost: '',
            type: 'Standard Delivery'
        });
        setErrors({});
    };

    const columns = ['Trip ID', 'Type', 'Origin', 'Destination', 'Status'];

    const renderRow = (trip) => (
        <>
            <td className="px-8 py-5">
                <span className="font-black text-softblack">{trip.id}</span>
            </td>
            <td className="px-8 py-5">
                <span className="text-sm font-bold text-softblack">{trip.type || 'Fright'}</span>
            </td>
            <td className="px-8 py-5">
                <span className="text-sm font-semibold text-softblack">{trip.origin}</span>
            </td>
            <td className="px-8 py-5">
                <span className="text-sm font-semibold text-softblack">{trip.destination}</span>
            </td>
            <td className="px-8 py-5">
                <StatusBadge status={trip.status} />
            </td>
        </>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Map Section */}
            <div className="bg-white rounded-4xl shadow-thick border border-border/30 overflow-hidden relative group">
                <div className="absolute top-6 left-8 z-10 flex flex-col gap-2">
                    <div className="px-4 py-2 bg-softblack/80 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">6 Active Dispatches</span>
                    </div>
                </div>

                <div className="absolute top-6 right-8 z-10">
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="btn-primary py-3 px-8 text-sm font-black shadow-thick flex items-center gap-2 group-hover:scale-105 transition-transform"
                    >
                        <Plus size={18} />
                        New Dispatch
                    </button>
                </div>

                {/* Styled Map Container */}
                <div className="h-96 md:h-[500px] w-full bg-background relative overflow-hidden">
                    {/* Placeholder for Google Maps View - Styled for Hackathon */}
                    <iframe
                        title="fleet-map"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15233.12563725586!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1708500000000!5m2!1sen!2sin"
                        allowFullScreen
                    />
                    <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]" />
                </div>
            </div>

            {/* Trip Table Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div>
                        <h3 className="text-2xl font-black text-softblack tracking-tight">Industrial Log</h3>
                        <p className="text-gray-400 font-medium text-sm">Full transit history and audit data</p>
                    </div>
                    <div className="relative group w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-olive transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find specific trip..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-white border border-border/40 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-olive/10 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-4xl shadow-thick border border-border/30 overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={filteredTrips}
                        renderRow={renderRow}
                    />
                </div>
            </div>

            {/* SideDrawer for Dispatch Form */}
            <SideDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Industrial Trip Launcher"
            >
                <form onSubmit={handleDispatch} className="space-y-8 pb-10">
                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-olive uppercase tracking-[0.3em] flex items-center gap-3">
                            <div className="w-4 h-[2px] bg-olive" />
                            Core Assignment
                        </h4>

                        <div className="grid grid-cols-1 gap-6">
                            <FormSelectField
                                label="Vehicle Platform"
                                icon={Truck}
                                value={newTrip.vehiclePlate}
                                onChange={(e) => setNewTrip({ ...newTrip, vehiclePlate: e.target.value })}
                                options={availableVehicles.map(v => ({ id: v.plate, value: v.plate, label: `${v.name} (${v.plate}) - Max ${v.capacity}` }))}
                                error={errors.vehiclePlate}
                            />
                            <FormInputField
                                label="Logistics Operator (Driver)"
                                icon={User}
                                value={newTrip.driverName}
                                onChange={(e) => setNewTrip({ ...newTrip, driverName: e.target.value })}
                                options={availableDrivers.map(d => ({ id: d.name, value: d.name, label: d.name }))}
                                error={errors.driverName}
                            />
                        </div>
                    </div>

                    <div className="space-y-6 pt-4">
                        <h4 className="text-xs font-black text-olive uppercase tracking-[0.3em] flex items-center gap-3">
                            <div className="w-4 h-[2px] bg-olive" />
                            Transit Parameters
                        </h4>

                        <div className="grid grid-cols-1 gap-6">
                            <FormInputField
                                label="Origin Hub"
                                icon={MapPin}
                                placeholder="Pickup location"
                                value={newTrip.origin}
                                error={errors.origin}
                                onChange={(e) => setNewTrip({ ...newTrip, origin: e.target.value })}
                            />
                            <FormInputField
                                label="Destination Hub"
                                icon={Navigation}
                                placeholder="Delivery drop-off"
                                value={newTrip.destination}
                                error={errors.destination}
                                onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInputField
                                label="Cargo Payload (Kg)"
                                icon={Weight}
                                type="number"
                                placeholder="e.g. 1500"
                                value={newTrip.cargoWeight}
                                warning={weightWarning}
                                error={errors.cargoWeight}
                                onChange={(e) => setNewTrip({ ...newTrip, cargoWeight: e.target.value })}
                            />
                            <FormInputField
                                label="Fuel Budget (₹)"
                                icon={Fuel}
                                type="number"
                                placeholder="0.00"
                                value={newTrip.fuelCost}
                                onChange={(e) => setNewTrip({ ...newTrip, fuelCost: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-10 flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={!!weightWarning}
                            className={`btn-primary py-5 px-12 text-xl font-black shadow-thick flex items-center justify-center gap-3 ${weightWarning ? 'opacity-50 cursor-not-allowed bg-gray-400 shadow-none' : ''}`}
                        >
                            <Activity size={24} />
                            Launch Transit
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(false)}
                            className="py-4 font-bold text-gray-400 hover:text-softblack transition-colors"
                        >
                            Cancel Mission
                        </button>
                    </div>
                </form>
            </SideDrawer>
        </div>
    );
};

export default Trips;
