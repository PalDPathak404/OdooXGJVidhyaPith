import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckCircle, AlertTriangle, Clock, XCircle, Activity } from 'lucide-react';

const StatusBadge = ({ status, showIcon = false }) => {
    const getStatusConfig = (status) => {
        const statusMap = {
            'On Trip': {
                color: 'status-operational',
                icon: Activity,
                text: 'ACTIVE'
            },
            'Available': {
                color: 'status-operational',
                icon: CheckCircle,
                text: 'READY'
            },
            'In Shop': {
                color: 'status-warning',
                icon: AlertTriangle,
                text: 'MAINTENANCE'
            },
            'Draft': {
                color: 'status-pending',
                icon: Clock,
                text: 'DRAFT'
            },
            'Pending': {
                color: 'status-pending',
                icon: Clock,
                text: 'PENDING'
            },
            'Completed': {
                color: 'status-operational',
                icon: CheckCircle,
                text: 'COMPLETED'
            },
            'Cancelled': {
                color: 'status-critical',
                icon: XCircle,
                text: 'CANCELLED'
            },
            'Active': {
                color: 'status-operational',
                icon: Activity,
                text: 'ACTIVE'
            },
            'Maintenance': {
                color: 'status-warning',
                icon: AlertTriangle,
                text: 'MAINTENANCE'
            },
            'Idle': {
                color: 'status-pending',
                icon: Clock,
                text: 'IDLE'
            },
            'Alert': {
                color: 'status-critical',
                icon: AlertTriangle,
                text: 'ALERT'
            }
        };
        return statusMap[status] || statusMap['Pending'];
    };

    const config = getStatusConfig(status);
    const Icon = config?.icon;

    return (
        <span className={`status-badge ${config?.color} font-mono`}>
            {showIcon && Icon && <Icon size={10} className="mr-1" />}
            {config?.text}
        </span>
    );
};

export default StatusBadge;
