import React, { useState, useMemo } from 'react';
import {
    Truck,
    Plus,
    Filter,
    Search,
    ChevronDown,
    Trash2,
    Edit3,
    Hash,
    Activity,
    Maximize2,
    Gauge
} from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const InputField = ({ label, icon: Icon, value, onChange, placeholder, type = "text", error }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-black text-softblack/60">{label}</label>
            {error && <span className="text-[10px] font-bold text-rust uppercase tracking-tighter">{error}</span>}
        </div>
        <div className="relative group">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-rust' : 'text-gray-400 group-focus-within:text-olive'}`}>
                <Icon size={18} />
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full pl-12 pr-6 py-3.5 bg-background border rounded-2xl focus:outline-none focus:ring-2 focus:bg-white transition-all text-softblack font-semibold placeholder:text-gray-400 ${error ? 'border-rust/50 focus:ring-rust/10' : 'border-border/40 focus:ring-olive/10'}`}
            />
        </div>
    </div>
);

const SelectField = ({ label, icon: Icon, value, onChange, options }) => (
    <div className="space-y-2">
        <label className="text-sm font-black text-softblack/60 ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-olive transition-colors z-10 pointer-events-none">
                <Icon size={18} />
            </div>
            <select
                value={value}
                onChange={onChange}
                className="w-full pl-12 pr-10 py-3.5 bg-background border border-border/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-olive/10 focus:bg-white transition-all text-softblack font-semibold appearance-none cursor-pointer"
            >
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
            </div>
        </div>
    </div>
);

const Vehicles = () => {
    const { vehicles, addVehicle, removeVehicle, currentUser } = useFleetStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [errors, setErrors] = useState({});
    const [newVehicle, setNewVehicle] = useState({
        name: '',
        plate: '',
        type: 'Heavy Truck',
        model: '',
        capacity: '',
        odometer: '',
        status: 'Available'
    });

    const [editingVehicle, setEditingVehicle] = useState(null);

    const validate = (data) => {
        const newErrors = {};
        if (!data.name) newErrors.name = "Required";
        if (!data.model) newErrors.model = "Required";
        if (!data.capacity) newErrors.capacity = "Required";
        if (!data.odometer) newErrors.odometer = "Required";

        // Reg No format: MH 01 AB 1234
        const plateRegex = /^[A-Z]{2}\s\d{2}\s[A-Z]{1,2}\s\d{4}$/;
        if (!data.plate) {
            newErrors.plate = "Required";
        } else if (!plateRegex.test(data.plate.toUpperCase())) {
            newErrors.plate = "Format: XX 00 XX 0000";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddVehicle = (e) => {
        e.preventDefault();
        if (!validate(newVehicle)) return;

        addVehicle({
            ...newVehicle,
            plate: newVehicle.plate.toUpperCase()
        });
        setIsModalOpen(false);
        setNewVehicle({
            name: '',
            plate: '',
            type: 'Heavy Truck',
            model: '',
            capacity: '',
            odometer: '',
            status: 'Available'
        });
        setErrors({});
    };

    const handleEditVehicle = (e) => {
        e.preventDefault();
        if (!validate(editingVehicle)) return;

        useFleetStore.getState().updateVehicle(editingVehicle.id, {
            ...editingVehicle,
            plate: editingVehicle.plate.toUpperCase()
        });
        setEditingVehicle(null);
        setErrors({});
    };

    const [statusFilter, setStatusFilter] = useState('All');

    const filteredVehicles = useMemo(() => {
        let result = vehicles.filter(v =>
            (v.plate?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (v.model?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (v.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );

        if (statusFilter !== 'All') {
            result = result.filter(v => v.status === statusFilter);
        }

        return result;
    }, [vehicles, searchTerm, statusFilter]);

    const columns = ['ID', 'Vehicle', 'Type', 'Capacity', 'Odometer', 'Status', 'Actions'];

    const renderRow = (vehicle) => (
        <>
            <td className="px-6 py-5">
                <span className="font-black text-softblack">{vehicle.id}</span>
            </td>
            <td className="px-6 py-5">
                <div className="flex flex-col">
                    <span className="font-bold text-softblack">{vehicle.name}</span>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{vehicle.plate}</span>
                </div>
            </td>
            <td className="px-6 py-5">
                <span className="text-sm font-semibold text-gray-500 bg-border/20 px-3 py-1 rounded-lg">
                    {vehicle.type}
                </span>
            </td>
            <td className="px-6 py-5">
                <span className="text-sm font-semibold text-softblack">{vehicle.capacity}</span>
            </td>
            <td className="px-6 py-5 text-sm font-semibold text-softblack">
                {vehicle.odometer} km
            </td>
            <td className="px-6 py-5">
                <StatusBadge status={vehicle.status} />
            </td>
            <td className="px-6 py-5">
                {['Administrator', 'Fleet Manager'].includes(currentUser?.role) ? (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setEditingVehicle(vehicle)}
                            className="p-2 hover:bg-olive/10 text-olive rounded-xl transition-colors"
                        >
                            <Edit3 size={18} />
                        </button>
                        <button
                            onClick={() => removeVehicle(vehicle.id)}
                            className="p-2 hover:bg-rust/10 text-rust rounded-xl transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ) : (
                    <span className="text-xs font-bold text-gray-300 uppercase italic">View Only</span>
                )}
            </td>
        </>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Actions */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1 max-w-2xl relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-olive transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by license plate, name, or model..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white border border-border/40 rounded-3xl shadow-soft focus:outline-none focus:ring-2 focus:ring-olive/10 transition-all font-medium placeholder:text-gray-400"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none pl-12 pr-10 py-4 bg-white border border-border/40 rounded-2xl shadow-soft font-bold text-softblack hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-olive/10 cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Available">Available</option>
                            <option value="On Trip">On Trip</option>
                            <option value="In Shop">In Shop</option>
                        </select>
                        <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    {['Administrator', 'Fleet Manager', 'Dispatcher', 'Safety Officer'].includes(currentUser?.role) && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary py-4 px-8 flex items-center gap-2 text-lg shadow-thick"
                        >
                            <Plus size={22} strokeWidth={3} />
                            Add Vehicle
                        </button>
                    )}
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-4xl shadow-soft border border-border/30 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={filteredVehicles}
                    renderRow={renderRow}
                />
            </div>

            {/* Add Vehicle Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="New Vehicle Registration"
            >
                <form onSubmit={handleAddVehicle} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <InputField
                            label="Vehicle Name"
                            icon={Truck}
                            placeholder="e.g. Scania R500"
                            value={newVehicle.name}
                            error={errors.name}
                            onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                        />
                        <InputField
                            label="Registration Number"
                            icon={Hash}
                            placeholder="MH 01 AB 1234"
                            value={newVehicle.plate}
                            error={errors.plate}
                            onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <SelectField
                            label="Vehicle Type"
                            icon={Activity}
                            value={newVehicle.type}
                            onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                            options={['Light Van', 'Heavy Truck', 'Trailer', 'Reefer']}
                        />
                        <InputField
                            label="Model"
                            icon={Truck}
                            placeholder="e.g. 2024 V-Series"
                            value={newVehicle.model}
                            error={errors.model}
                            onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <InputField
                            label="Max Payload"
                            icon={Maximize2}
                            placeholder="e.g. 20 tons"
                            value={newVehicle.capacity}
                            error={errors.capacity}
                            onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                        />
                        <InputField
                            label="Initial Odometer"
                            icon={Gauge}
                            placeholder="current km reading"
                            type="number"
                            value={newVehicle.odometer}
                            error={errors.odometer}
                            onChange={(e) => setNewVehicle({ ...newVehicle, odometer: e.target.value })}
                        />
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-4 bg-background border border-border/40 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn-primary py-4 font-black shadow-thick"
                        >
                            Save Vehicle
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Vehicle Modal */}
            <Modal
                isOpen={!!editingVehicle}
                onClose={() => setEditingVehicle(null)}
                title="Edit Vehicle Details"
            >
                {editingVehicle && (
                    <form onSubmit={handleEditVehicle} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <InputField
                                label="Vehicle Name"
                                icon={Truck}
                                placeholder="e.g. Scania R500"
                                value={editingVehicle.name}
                                error={errors.name}
                                onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                            />
                            <InputField
                                label="Registration Number"
                                icon={Hash}
                                placeholder="MH 01 AB 1234"
                                value={editingVehicle.plate}
                                error={errors.plate}
                                onChange={(e) => setEditingVehicle({ ...editingVehicle, plate: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <SelectField
                                label="Vehicle Type"
                                icon={Activity}
                                value={editingVehicle.type}
                                onChange={(e) => setEditingVehicle({ ...editingVehicle, type: e.target.value })}
                                options={['Light Van', 'Heavy Truck', 'Trailer', 'Reefer']}
                            />
                            <InputField
                                label="Model"
                                icon={Truck}
                                placeholder="e.g. 2024 V-Series"
                                value={editingVehicle.model}
                                error={errors.model}
                                onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <InputField
                                label="Max Payload"
                                icon={Maximize2}
                                placeholder="e.g. 20 tons"
                                value={editingVehicle.capacity}
                                error={errors.capacity}
                                onChange={(e) => setEditingVehicle({ ...editingVehicle, capacity: e.target.value })}
                            />
                            <InputField
                                label="Odometer"
                                icon={Gauge}
                                placeholder="current km reading"
                                type="number"
                                value={editingVehicle.odometer}
                                error={errors.odometer}
                                onChange={(e) => setEditingVehicle({ ...editingVehicle, odometer: e.target.value })}
                            />
                        </div>

                        <SelectField
                            label="Status"
                            icon={Activity}
                            value={editingVehicle.status}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, status: e.target.value })}
                            options={['Available', 'On Trip', 'In Shop']}
                        />

                        <div className="pt-6 flex gap-4">
                            <button
                                type="button"
                                onClick={() => setEditingVehicle(null)}
                                className="flex-1 py-4 bg-background border border-border/40 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 btn-primary py-4 font-black shadow-thick"
                            >
                                Update Vehicle
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default Vehicles;
