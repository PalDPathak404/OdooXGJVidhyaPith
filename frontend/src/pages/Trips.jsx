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
import AccessRestricted from '../components/AccessRestricted';
import FleetMap from '../components/FleetMap';
import CustomSelect from '../components/CustomSelect';

const FormInputField = ({ label, icon: Icon, value, onChange, placeholder, type = "text", error, warning }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-black text-text-muted">{label}</label>
            {error && <span className="text-[10px] font-bold text-danger uppercase tracking-tighter">{error}</span>}
            {warning && <span className="text-[10px] font-bold text-warning uppercase tracking-tighter">{warning}</span>}
        </div>
        <div className="relative group">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error || warning ? 'text-danger' : 'text-text-secondary group-focus-within:text-primary'}`}>
                <Icon size={18} />
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full pl-12 pr-6 py-4 bg-surface border rounded-2xl focus:outline-none focus:ring-2 focus:bg-surface-elevated transition-all text-text-primary font-semibold placeholder:text-text-muted ${error || warning ? 'border-danger/50 focus:ring-danger/10' : 'border-border focus:ring-primary/10'}`}
            />
        </div>
    </div>
);

const FormSelectField = ({ label, icon: Icon, value, onChange, options, error }) => (
    <div className="space-y-2">
        <label className="text-sm font-black text-text-muted ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors z-10 pointer-events-none">
                <Icon size={18} />
            </div>
            <select
                value={value}
                onChange={onChange}
                className={`w-full pl-12 pr-10 py-4 bg-surface border rounded-2xl focus:outline-none focus:ring-2 focus:bg-surface-elevated transition-all text-text-primary font-semibold appearance-none cursor-pointer ${error ? 'border-danger/50 focus:ring-danger/10' : 'border-border focus:ring-primary/10'}`}
            >
                <option value="">Select Option</option>
                {options.map(opt => (
                    <option key={opt.id || opt} value={opt.value || opt}>{opt.label || opt}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
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

    // RBAC check
    const hasAccess = ['Administrator', 'Fleet Manager', 'Dispatcher'].includes(currentUser?.role);
    if (!hasAccess) return <AccessRestricted />;

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
            <td className="px-6 py-4">
                <span className="font-black text-text-primary">#{trip.id}</span>
            </td>
            <td className="px-6 py-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-elevated border border-border rounded-lg text-[10px] font-black text-text-muted uppercase tracking-wider">
                    {trip.type || 'Fright'}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-primary" />
                    <span className="text-sm font-bold text-text-primary">{trip.origin}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <Navigation size={14} className="text-accent" />
                    <span className="text-sm font-bold text-text-primary">{trip.destination}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <StatusBadge status={trip.status} />
            </td>
        </>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Map Section */}
            <div className="card-elevated rounded-4xl border border-border/30 overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-8 pt-6 pb-4">
                    <div className="px-4 py-2 bg-surface-elevated rounded-2xl border border-border flex items-center gap-3 shadow-md">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">
                            {trips.filter(t => t.status === 'On Trip').length} Active Dispatches
                        </span>
                    </div>
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="btn-primary py-3 px-8 text-sm font-black shadow-lg flex items-center gap-2"
                    >
                        <Plus size={18} />
                        New Dispatch
                    </button>
                </div>

                {/* Styled Map Container */}
                <div className="w-full bg-surface relative overflow-hidden">
                    <FleetMap />
                    <div className="absolute inset-0 pointer-events-none border-[1px] border-border/10 shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]" />
                </div>
            </div>

            {/* Trip Table Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div>
                        <h3 className="text-2xl font-black text-text-primary tracking-tight">Industrial Log</h3>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Full transit history and audit data</p>
                    </div>
                    <div className="relative group w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find specific trip..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-surface border border-border/40 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-text-primary placeholder:text-text-muted/50"
                        />
                    </div>
                </div>

                <div className="card-elevated overflow-hidden border border-border/20 shadow-glow/10">
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
        </div >
    );
};

export default Trips;
