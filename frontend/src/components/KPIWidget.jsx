import React from 'react';
import { motion } from 'framer-motion';

const KPIWidget = ({ title, value, icon: Icon, colorClass = "text-olive" }) => {
    return (
        <div className="card flex-1 flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-background border border-gray-100 shadow-soft`}>
                <Icon className={colorClass} size={28} />
            </div>
            <div>
                <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider">{title}</h3>
                <p className="text-3xl font-extrabold text-softblack mt-1">{value}</p>
            </div>
        </div>
    );
};

export default KPIWidget;
