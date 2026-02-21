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
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import DataExport from '../components/DataExport';
import { useTheme } from '../contexts/ThemeContext';

const Analytics = () => {
    const { getAnalytics, monthlyData, currentUser } = useFleetStore();
    const { theme } = useTheme();

    // RBAC check
    const hasAccess = ['Administrator', 'Financial Analyst'].includes(currentUser?.role);
    if (!hasAccess) return <AccessRestricted />;

    const analytics = getAnalytics();

    return (
        <div className="space-y-8">
            {/* key={theme} forces charts to remount and recalculate after theme switch */}
            <AdvancedAnalytics key={theme} />
            <DataExport />
        </div>
    );
};

export default Analytics;
