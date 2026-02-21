import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
const StatusBadge = ({ status, className }) => {
    if (!status) return null;
    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'on trip':
            case 'available':
                return 'bg-olive/10 text-olive border-olive/20';
            case 'warning':
            case 'in shop':
                return 'bg-rust/10 text-rust border-rust/20';
            case 'danger':
            case 'retired':
                return 'bg-maroon/10 text-maroon border-maroon/20';
            case 'pending':
            case 'draft':
                return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    return (
        <span className={twMerge(
            "px-3 py-1 rounded-full text-xs font-bold border",
            getStatusStyles(status),
            className
        )}>
            {status}
        </span>
    );
};

export default StatusBadge;
