import React, { useState, useMemo } from 'react';
import {
    Wallet,
    Plus,
    Search,
    Filter,
    TrendingUp,
    Fuel,
    Wrench,
    Calculator,
    ChevronRight,
    ArrowUpRight,
    Activity
} from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import DataTable from '../components/DataTable';
import SideDrawer from '../components/SideDrawer';
import AccessRestricted from '../components/AccessRestricted';
import StatusBadge from '../components/StatusBadge';

const Expenses = () => {
    const { expenses, trips, addExpense, currentUser } = useFleetStore();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // RBAC: Financials restricted to specific roles
    const hasAccess = ['Administrator', 'Fleet Manager', 'Financial Analyst'].includes(currentUser?.role);

    // Form State
    const [formData, setFormData] = useState({
        tripId: '',
        fuelLiters: '',
        fuelPricePerLiter: '',
        maintenanceCost: ''
    });

    if (!hasAccess) return <AccessRestricted />;

    const filteredExpenses = useMemo(() => {
        return expenses.filter(e =>
            (e.tripId || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [expenses, searchTerm]);

    const totalFuel = expenses.reduce((sum, e) => sum + Number(e.fuelCost || 0), 0);
    const totalMaintenance = expenses.reduce((sum, e) => sum + Number(e.maintenanceCost || 0), 0);
    const grandTotal = totalFuel + totalMaintenance;

    const handleAddExpense = (e) => {
        e.preventDefault();
        const fuelCost = Number(formData.fuelLiters) * Number(formData.fuelPricePerLiter);

        addExpense({
            ...formData,
            fuelLiters: Number(formData.fuelLiters),
            fuelPricePerLiter: Number(formData.fuelPricePerLiter),
            fuelCost: fuelCost,
            maintenanceCost: Number(formData.maintenanceCost)
        });
        setFormData({ tripId: '', fuelLiters: '', fuelPricePerLiter: '', maintenanceCost: '' });
        setIsDrawerOpen(false);
    };

    const columns = ['Trip ID', 'Driver', 'Distance', 'Fuel Expense', 'Maintenance', 'Total Cost'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Stats Section */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-surface p-8 rounded-[2.5rem] shadow-soft border border-border/20 flex items-center justify-between group hover:shadow-thick transition-all overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                    <div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Total Fleet Expenditure</p>
                        <h2 className="text-4xl font-black text-text-primary tracking-tighter">₹{grandTotal.toLocaleString()}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <TrendingUp size={14} className="text-primary" />
                            <span className="text-xs font-bold text-primary">+12.5% from last month</span>
                        </div>
                    </div>
                    <div className="w-16 h-16 bg-surface-elevated rounded-2xl flex items-center justify-center text-primary relative z-10">
                        <Wallet size={32} />
                    </div>
                </div>

                <div className="w-full md:w-80 card-elevated rounded-[2.5rem] shadow-lg text-text-primary flex flex-col justify-between p-8">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-5">Active Budgets</p>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-text-secondary flex items-center gap-1.5"><Fuel size={12} className="text-primary" />Fuel Capacity</span>
                                <span className="text-primary">82%</span>
                            </div>
                            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[82%] rounded-full" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-text-secondary flex items-center gap-1.5"><Wrench size={12} className="text-warning" />Maintenance</span>
                                <span className="text-warning">61%</span>
                            </div>
                            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                                <div className="h-full bg-warning w-[61%] rounded-full" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-text-secondary flex items-center gap-1.5"><Calculator size={12} className="text-accent" />Operations</span>
                                <span className="text-accent">45%</span>
                            </div>
                            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                                <div className="h-full bg-accent w-[45%] rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter & Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Filter by Trip ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 input-field font-bold rounded-2xl"
                    />
                </div>
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="w-full sm:w-auto btn-primary py-4 px-8 shadow-thick flex items-center justify-center gap-2"
                >
                    <Plus size={20} strokeWidth={3} />
                    Add Expense
                </button>
            </div>

            {/* Main Table Card */}
            <div className="card-elevated overflow-hidden border border-border/20">
                <DataTable
                    columns={columns}
                    data={filteredExpenses}
                    renderRow={(expense) => {
                        const trip = trips.find(t => t.id === expense.tripId) || { driver: 'Unknown', distance: '0 km' };
                        const isHighCost = (expense.totalCost || 0) > 10000;

                        return (
                            <>
                                <td className="px-6 py-4 text-sm font-black text-text-primary">#{expense.tripId?.toUpperCase() || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-text-muted font-bold text-[10px]">
                                            {trip.driver.charAt(0)}
                                        </div>
                                        <span className="text-sm font-bold text-text-primary">{trip.driver}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-text-secondary">{trip.distance}</td>
                                <td className="px-6 py-4 text-sm font-bold text-text-primary">₹{expense.fuelCost?.toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm font-bold text-text-primary">₹{expense.maintenanceCost?.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-black ${isHighCost ? 'text-accent' : 'text-primary'}`}>
                                            ₹{expense.totalCost?.toLocaleString()}
                                        </span>
                                        {isHighCost && <ArrowUpRight size={14} className="text-accent" />}
                                    </div>
                                </td>
                            </>
                        );
                    }}
                />
            </div>

            {/* New Expense SideDrawer */}
            <SideDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Log Operational Expenditure"
            >
                <form onSubmit={handleAddExpense} className="space-y-8 py-4">
                    <div className="space-y-6">
                        <div className="p-8 bg-surface-elevated rounded-4xl border border-border/30 space-y-6">
                            <h4 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <Activity size={14} /> Trip Association
                            </h4>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Trip Reference</label>
                                <select
                                    required
                                    className="input-field px-6 py-4 rounded-2xl font-bold"
                                    value={formData.tripId}
                                    onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                                >
                                    <option value="">Select Trip ID</option>
                                    {trips.map(trip => (
                                        <option key={trip.id} value={trip.id}>#{trip.id?.toUpperCase() || 'N/A'} - {trip.driver}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="p-8 bg-surface rounded-4xl border border-border/30 space-y-6 shadow-md">
                            <h4 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <Calculator size={14} /> Fiscal Details
                            </h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Fuel Liters</label>
                                    <div className="relative">
                                        <Fuel className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                        <input
                                            type="number"
                                            required
                                            placeholder="0"
                                            className="w-full bg-surface-elevated border border-border/40 pl-11 pr-4 py-4 rounded-xl font-bold text-text-primary focus:outline-none focus:border-primary"
                                            value={formData.fuelLiters}
                                            onChange={(e) => setFormData({ ...formData, fuelLiters: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Fuel Price (₹/L)</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0"
                                        className="w-full bg-surface-elevated border border-border/40 px-4 py-4 rounded-xl font-bold text-text-primary focus:outline-none focus:border-primary"
                                        value={formData.fuelPricePerLiter}
                                        onChange={(e) => setFormData({ ...formData, fuelPricePerLiter: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Maintenance / Misc Cost (₹)</label>
                                <div className="relative">
                                    <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                    <input
                                        type="number"
                                        required
                                        placeholder="0"
                                        className="w-full bg-surface-elevated border border-border/40 pl-11 pr-4 py-4 rounded-xl font-bold text-text-primary focus:outline-none focus:border-primary"
                                        value={formData.maintenanceCost}
                                        onChange={(e) => setFormData({ ...formData, maintenanceCost: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="p-6 bg-olive/10 rounded-3xl border border-olive/20 flex items-center justify-between px-8">
                            <div>
                                <p className="text-[10px] font-black text-olive uppercase tracking-widest">Estimated Total</p>
                                <p className="text-2xl font-black text-olive">₹{((Number(formData.fuelLiters || 0) * Number(formData.fuelPricePerLiter || 0)) + Number(formData.maintenanceCost || 0)).toLocaleString()}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-olive text-white flex items-center justify-center">
                                <Calculator size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(false)}
                            className="flex-1 py-5 bg-background border border-border/40 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] btn-primary py-5 shadow-thick uppercase tracking-widest text-xs font-black"
                        >
                            Execute Ledger Entry
                        </button>
                    </div>
                </form>
            </SideDrawer>
        </div>
    );
};

export default Expenses;
