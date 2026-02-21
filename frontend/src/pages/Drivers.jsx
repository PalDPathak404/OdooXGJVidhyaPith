import React, { useState, useMemo } from 'react';
import {
    Users,
    Search,
    ShieldCheck,
    AlertCircle,
    ChevronDown,
    BarChart2,
    Calendar,
    Award
} from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import DataTable from '../components/DataTable';
import AccessRestricted from '../components/AccessRestricted';

const Drivers = () => {
    const { drivers, trips, updateDriverStatus, currentUser } = useFleetStore();
    const [searchTerm, setSearchTerm] = useState('');

    // RBAC check
    const hasAccess = ['Administrator', 'Safety Officer'].includes(currentUser?.role);

    const today = new Date();

    const calculatePerformance = (driverName) => {
        const driverTrips = trips.filter(t => t.driver === driverName);
        if (driverTrips.length === 0) return 0;
        const completed = driverTrips.filter(t => t.status === 'Completed').length;
        return Math.round((completed / driverTrips.length) * 100);
    };

    const filteredDrivers = useMemo(() => {
        return drivers.filter(d =>
            d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.license.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [drivers, searchTerm]);

    if (!hasAccess) return <AccessRestricted />;

    const columns = ['Driver', 'License Expiry', 'Completion Rate', 'Safety Score', 'Status'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Minimal Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4">
                <div>
                    <h1 className="text-4xl font-black text-softblack tracking-tight mb-2">Driver Personnel</h1>
                    <p className="text-gray-400 font-medium">Monitoring operational integrity and safety compliance profile.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-soft border border-border/20">
                    <div className="flex -space-x-3 px-2">
                        {drivers.map((d, i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-background flex items-center justify-center text-[10px] font-black text-gray-400">
                                {d.name.charAt(0)}
                            </div>
                        ))}
                    </div>
                    <div className="h-8 w-[1px] bg-border/50" />
                    <div className="px-4 py-1 text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Active</p>
                        <p className="text-xl font-black text-softblack leading-tight">{drivers.length}</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search personnel or license..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white border border-border/30 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-olive/10 font-bold placeholder:text-gray-300 transition-all"
                />
            </div>

            {/* Minimal Personnel Table */}
            <div className="bg-white rounded-[2.5rem] shadow-soft border border-border/20 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={filteredDrivers}
                    renderRow={(driver) => {
                        const completionRate = calculatePerformance(driver.name);
                        const expiryDate = new Date(driver.licenseExpiry);
                        const isExpired = expiryDate < today;
                        const safetyStatus = driver.safetyScore >= 90 ? 'High' : (driver.safetyScore >= 80 ? 'Standard' : 'Warning');

                        return (
                            <tr key={driver.id} className="hover:bg-background/20 transition-colors border-b border-border/10 last:border-none">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-olive transition-colors relative">
                                            {driver.status === 'On Duty' && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                            )}
                                            <Users size={24} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-softblack uppercase tracking-tight">{driver.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{driver.license}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${isExpired ? 'bg-rust/5 border-rust/20 text-rust' : 'bg-background border-border/30 text-gray-500'}`}>
                                        <Calendar size={12} />
                                        <span className="text-xs font-black">{driver.licenseExpiry}</span>
                                        {isExpired && <AlertCircle size={12} />}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="space-y-1.5 min-w-[120px]">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            <span>Task Success</span>
                                            <span className="text-softblack">{completionRate}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ${completionRate >= 80 ? 'bg-olive' : (completionRate >= 50 ? 'bg-charcoal' : 'bg-rust')}`}
                                                style={{ width: `${completionRate}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-lg ${safetyStatus === 'High' ? 'bg-olive/10 text-olive' : (safetyStatus === 'Standard' ? 'bg-charcoal/10 text-charcoal' : 'bg-rust/10 text-rust')}`}>
                                            <ShieldCheck size={16} />
                                        </div>
                                        <span className={`text-lg font-black tracking-tighter ${safetyStatus === 'High' ? 'text-olive' : (safetyStatus === 'Standard' ? 'text-charcoal' : 'text-rust')}`}>
                                            {driver.safetyScore}%
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="relative group/select">
                                        <select
                                            className="appearance-none bg-background border border-border/30 pl-4 pr-10 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-softblack focus:outline-none focus:ring-2 focus:ring-olive/10 cursor-pointer"
                                            value={driver.status}
                                            onChange={(e) => updateDriverStatus(driver.id, e.target.value)}
                                        >
                                            <option value="On Duty">On Duty</option>
                                            <option value="Taking a Break">Taking a Break</option>
                                            <option value="Suspended">Suspended</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover/select:text-olive transition-colors" />
                                    </div>
                                </td>
                            </tr>
                        );
                    }}
                />
            </div>

            {/* Performance Insights Unique Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-softblack p-10 rounded-[3rem] text-white shadow-thick relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 transform group-hover:rotate-12 transition-transform duration-500">
                        <Award size={120} className="text-white/5" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black tracking-tight mb-4 flex items-center gap-3">
                            <BarChart2 className="text-olive" /> Top Performance Protocol
                        </h3>
                        <p className="text-gray-400 text-sm font-medium max-w-sm mb-8">System intelligence identifies highly reliable operators based on safety patterns and schedule compliance.</p>

                        <div className="space-y-4">
                            {drivers.filter(d => d.safetyScore >= 95).map((d, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-olive">{i + 1}</span>
                                        <span className="text-sm font-bold uppercase tracking-widest">{d.name}</span>
                                    </div>
                                    <span className="px-3 py-1 bg-olive/20 text-olive text-[10px] font-black rounded-lg">ELITE</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-border/20 shadow-soft relative overflow-hidden flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-softblack tracking-tight mb-2">Safety Compliance</h3>
                        <p className="text-gray-400 text-sm font-medium">Auto-monitoring license integrity.</p>
                    </div>

                    <div className="mt-8 p-6 bg-background rounded-3xl border border-border/10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Expired Documents</span>
                            <span className="px-2 py-0.5 bg-rust/10 text-rust text-[10px] font-black rounded">{drivers.filter(d => new Date(d.licenseExpiry) < today).length} Issues</span>
                        </div>
                        <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                            <div
                                className="h-full bg-rust transition-all"
                                style={{ width: `${(drivers.filter(d => new Date(d.licenseExpiry) < today).length / drivers.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Drivers;
