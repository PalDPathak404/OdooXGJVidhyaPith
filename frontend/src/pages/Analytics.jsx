import React, { useMemo } from 'react';
import {
    TrendingUp,
    BarChart3,
    PieChart,
    DollarSign,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    TrendingDown,
    Zap
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import useFleetStore from '../store/fleetStore';
import AccessRestricted from '../components/AccessRestricted';
import DataTable from '../components/DataTable';

const Analytics = () => {
    const { getAnalytics, monthlyData, currentUser } = useFleetStore();

    // RBAC check
    const hasAccess = ['Administrator', 'Financial Analyst'].includes(currentUser?.role);
    if (!hasAccess) return <AccessRestricted />;

    const analytics = getAnalytics();

    const KPIBadge = ({ title, value, icon: Icon, trend, trendValue }) => (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-border/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Icon size={80} className="text-olive" />
            </div>
            <div className="relative z-10">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</span>
                <div className="mt-2 flex items-baseline gap-2">
                    <h3 className="text-4xl font-black text-softblack tracking-tighter">{value}</h3>
                    {trend && (
                        <div className={`flex items-center text-[10px] font-black px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-olive/10 text-olive' : 'bg-rust/10 text-rust'}`}>
                            {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {trendValue}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const TableHeader = ['Month', 'Revenue', 'Fuel Cost', 'Maintenance', 'Net Profit'];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-softblack tracking-tight mb-2 uppercase">Financial Intelligence</h1>
                <p className="text-gray-400 font-medium">Aggregated operational metrics and resource ROI analysis.</p>
            </div>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <KPIBadge
                    title="Total Fuel Cost"
                    value={`₹${(analytics.totalFuel / 100000).toFixed(1)}L`}
                    icon={DollarSign}
                    trend="up"
                    trendValue="4.2%"
                />
                <KPIBadge
                    title="Fleet ROI"
                    value={`+${analytics.roi}%`}
                    icon={TrendingUp}
                    trend="up"
                    trendValue="12.5%"
                />
                <KPIBadge
                    title="Utilization Rate"
                    value={`${analytics.utilization}%`}
                    icon={PieChart}
                    trend="down"
                    trendValue="1.8%"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left: Fuel Efficiency Trend */}
                <div className="lg:col-span-3 bg-white p-10 rounded-[3rem] shadow-soft border border-border/20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-xl font-black text-softblack tracking-tight">Fuel Efficiency Trend</h4>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Metrics in km/L</p>
                        </div>
                        <Activity className="text-olive/30" />
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#9ca3af' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#9ca3af' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '15px' }}
                                    itemStyle={{ fontWeight: 900, fontSize: '12px' }}
                                    labelStyle={{ fontWeight: 900, marginBottom: '5px', textTransform: 'uppercase', color: '#1a1a1a' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="efficiency"
                                    stroke="#4A5D23"
                                    strokeWidth={4}
                                    dot={{ fill: '#4A5D23', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Top 5 Costliest Vehicles */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-soft border border-border/20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-xl font-black text-softblack tracking-tight">Vehicle Burn Rate</h4>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Top 5 Costliest Units</p>
                        </div>
                        <TrendingDown className="text-rust/30" />
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.vehicleCosts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                <XAxis type="number" hide />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#1a1a1a' }}
                                    width={100}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f9f8f3' }}
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                                />
                                <Bar dataKey="cost" radius={[0, 10, 10, 0]} barSize={25}>
                                    {analytics.vehicleCosts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#8B4513' : '#8B451399'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Table: Financial Summary */}
            <div className="bg-white rounded-[3.5rem] shadow-soft border border-border/20 overflow-hidden">
                <div className="p-10 border-b border-border/10 flex justify-between items-end">
                    <div>
                        <h3 className="text-2xl font-black text-softblack tracking-tight">Monthly Summary</h3>
                        <p className="text-gray-400 text-sm font-medium">Platform financial audit history.</p>
                    </div>
                </div>
                <DataTable
                    columns={TableHeader}
                    data={monthlyData}
                    renderRow={(item) => (
                        <tr key={item.month} className="hover:bg-background/20 transition-colors border-b border-border/10 last:border-none">
                            <td className="px-10 py-6">
                                <span className="text-sm font-black text-softblack uppercase tracking-widest">{item.month}</span>
                            </td>
                            <td className="px-10 py-6">
                                <span className="text-sm font-bold text-softblack">₹{(item.revenue / 100000).toFixed(1)}L</span>
                            </td>
                            <td className="px-10 py-6 font-bold text-gray-500">
                                ₹{(item.fuel / 100000).toFixed(1)}L
                            </td>
                            <td className="px-10 py-6 font-bold text-gray-500">
                                ₹{(item.maintenance / 100000).toFixed(1)}L
                            </td>
                            <td className="px-10 py-6">
                                <span className="px-3 py-1 bg-olive/10 text-olive text-xs font-black rounded-lg">
                                    ₹{((item.revenue - item.fuel - item.maintenance) / 100000).toFixed(1)}L
                                </span>
                            </td>
                        </tr>
                    )}
                />
            </div>
        </div>
    );
};

export default Analytics;
