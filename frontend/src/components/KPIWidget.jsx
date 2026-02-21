import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const KPIWidget = ({ title, value, icon: Icon, colorClass = "text-primary", trend, subtitle }) => {
    const getTrendIcon = (trend) => {
        if (trend === 'up') return <TrendingUp size={16} className="text-success" />;
        if (trend === 'down') return <TrendingDown size={16} className="text-danger" />;
        return null;
    };

    return (
        <div className="card-elevated p-6 hover:shadow-glow transition-all duration-500 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`p-3 bg-surface-elevated rounded-xl border border-border shadow-inner text-primary group-hover:text-text-primary transition-colors`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-surface-elevated border border-border rounded-lg shadow-sm">
                        {getTrendIcon(trend)}
                        <span className={`text-[10px] font-black tracking-widest ${trend === 'up' ? 'text-primary' : 'text-danger'}`}>
                            {trend === 'up' ? '+' : '-'}{Math.abs(5.2)}%
                        </span>
                    </div>
                )}
            </div>
            <div className="relative z-10">
                <h3 className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-text-primary tabular-nums tracking-tighter">{value}</p>
                </div>
                {subtitle && <p className="text-[10px] font-bold text-text-muted mt-2 tracking-wide uppercase">{subtitle}</p>}
            </div>
        </div>
    );
};

export default KPIWidget;
