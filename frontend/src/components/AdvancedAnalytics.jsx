import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Zap, Target, AlertCircle } from 'lucide-react';

const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [animatedValues, setAnimatedValues] = useState({
    efficiency: 0,
    utilization: 0,
    costSavings: 0,
    onTimeDelivery: 0
  });

  // Sample data for charts
  const performanceData = [
    { name: 'Mon', efficiency: 85, utilization: 78, cost: 2400 },
    { name: 'Tue', efficiency: 88, utilization: 82, cost: 2210 },
    { name: 'Wed', efficiency: 92, utilization: 85, cost: 2290 },
    { name: 'Thu', efficiency: 87, utilization: 80, cost: 2380 },
    { name: 'Fri', efficiency: 94, utilization: 88, cost: 2150 },
    { name: 'Sat', efficiency: 91, utilization: 83, cost: 2050 },
    { name: 'Sun', efficiency: 89, utilization: 81, cost: 2100 }
  ];

  const fleetDistribution = [
    { name: 'Active', value: 45, color: 'var(--color-primary)' },
    { name: 'Maintenance', value: 8, color: 'var(--color-warning)' },
    { name: 'Standby', value: 12, color: 'var(--color-text-muted)' },
    { name: 'Transit', value: 25, color: 'var(--color-accent)' }
  ];

  const costAnalysis = [
    { month: 'Jan', fuel: 12000, maintenance: 8000, operations: 15000 },
    { month: 'Feb', fuel: 11000, maintenance: 9000, operations: 14000 },
    { month: 'Mar', fuel: 13000, maintenance: 7000, operations: 16000 },
    { month: 'Apr', fuel: 12500, maintenance: 8500, operations: 15500 },
    { month: 'May', fuel: 11800, maintenance: 7800, operations: 14800 },
    { month: 'Jun', fuel: 12200, maintenance: 8200, operations: 15200 }
  ];

  useEffect(() => {
    // Animate metrics on mount
    const timer = setTimeout(() => {
      setAnimatedValues({
        efficiency: 94.2,
        utilization: 87.8,
        costSavings: 15.3,
        onTimeDelivery: 96.5
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const MetricCard = ({ title, value, unit, trend, icon: Icon, color }) => (
    <div className="card-elevated p-6 hover:shadow-glow transition-all duration-500 overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`p-3 bg-surface-elevated rounded-xl border border-border shadow-inner ${color}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 bg-surface-elevated border border-border rounded-lg shadow-sm`}>
          {trend > 0 ? <TrendingUp size={14} className="text-primary" /> : <TrendingDown size={14} className="text-danger" />}
          <span className={`text-[10px] font-black tracking-widest ${trend > 0 ? 'text-primary' : 'text-danger'}`}>
            {Math.abs(trend)}%
          </span>
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</h3>
        <p className="text-3xl font-black text-text-primary tabular-nums tracking-tighter">
          {animatedValues[value]}{unit}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Fleet Efficiency"
          value="efficiency"
          unit="%"
          trend={2.3}
          icon={Activity}
          color="text-primary"
        />
        <MetricCard
          title="Asset Utilization"
          value="utilization"
          unit="%"
          trend={1.8}
          icon={Target}
          color="text-accent"
        />
        <MetricCard
          title="Cost Savings"
          value="costSavings"
          unit="%"
          trend={3.2}
          icon={Zap}
          color="text-success"
        />
        <MetricCard
          title="On-Time Delivery"
          value="onTimeDelivery"
          unit="%"
          trend={0.5}
          icon={AlertCircle}
          color="text-warning"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-bold text-text-primary mb-6">Performance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-text-muted)" />
              <YAxis stroke="var(--color-text-muted)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="efficiency"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#efficiencyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Fleet Distribution */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-bold text-text-primary mb-6">Fleet Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fleetDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {fleetDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {fleetDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-text-secondary">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="card-elevated p-6">
        <h3 className="text-lg font-bold text-text-primary mb-6">Cost Analysis</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={costAnalysis}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-text-muted)" />
            <YAxis stroke="var(--color-text-muted)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="fuel" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="maintenance" fill="var(--color-warning)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="operations" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
