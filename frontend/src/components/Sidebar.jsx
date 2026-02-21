import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Car,
    MapPin,
    Wrench,
    DollarSign,
    Users,
    BarChart3,
    LogOut,
    Truck,
    Activity,
    Shield,
    Radar
} from 'lucide-react';
import useFleetStore from '../store/fleetStore';

const Sidebar = () => {
    const { currentUser, logout } = useFleetStore();
    const role = currentUser?.role || 'Financial Analyst';

    const allNavItems = [
        { name: 'Command Center', icon: <LayoutDashboard size={18} />, path: '/', roles: ['Administrator', 'Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
        { name: 'Fleet Assets', icon: <Car size={18} />, path: '/vehicles', roles: ['Administrator', 'Fleet Manager', 'Dispatcher', 'Safety Officer'] },
        { name: 'Mission Control', icon: <MapPin size={18} />, path: '/trips', roles: ['Administrator', 'Fleet Manager', 'Dispatcher'] },
        { name: 'Maintenance Bay', icon: <Wrench size={18} />, path: '/maintenance', roles: ['Administrator', 'Fleet Manager', 'Safety Officer'] },
        { name: 'Financial Hub', icon: <DollarSign size={18} />, path: '/expenses', roles: ['Administrator', 'Fleet Manager', 'Financial Analyst'] },
        { name: 'Personnel', icon: <Users size={18} />, path: '/drivers', roles: ['Administrator', 'Safety Officer'] },
        { name: 'Analytics', icon: <BarChart3 size={18} />, path: '/analytics', roles: ['Administrator', 'Financial Analyst'] },
    ];

    const navItems = allNavItems.filter(item => item.roles.includes(role));

    return (
        <div className="w-80 h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0">
            {/* Header Section */}
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-alt rounded-xl flex items-center justify-center shadow-lg">
                            <Truck size={24} className="text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-surface"></div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-text-primary tracking-tight">FLEETEDGE</h1>
                        <p className="text-xs text-text-muted font-mono uppercase tracking-widest">Enterprise Fleet v2.0</p>
                    </div>
                </div>

                {/* System Status */}
                <div className="flex items-center gap-2 px-3 py-2 bg-surface-elevated rounded-lg border border-border-subtle">
                    <Radar size={14} className="text-success" />
                    <span className="text-xs text-text-secondary font-mono">SYSTEM ONLINE</span>
                    <div className="ml-auto w-2 h-2 bg-success rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="mb-4">
                    <p className="text-xs text-text-muted font-bold uppercase tracking-wider px-3 mb-2">Navigation</p>
                </div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                        }
                    >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="font-medium text-sm">{item.name}</span>
                        {item.path === '/' && (
                            <div className="ml-auto">
                                <Activity size={14} className="text-primary" />
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer Section */}
            <div className="p-4 border-t border-border">
                <div className="mb-4 p-3 bg-surface-elevated rounded-lg border border-border-subtle">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Operator</span>
                        <Shield size={12} className="text-primary" />
                    </div>
                    <p className="text-sm font-bold text-text-primary">{role}</p>
                    <p className="text-xs text-text-secondary font-mono mt-1">ID: {currentUser?.id || 'GUEST'}</p>
                </div>

                <button
                    onClick={() => logout()}
                    className="sidebar-link w-full text-danger hover:bg-danger/10 hover:text-danger transition-all duration-200 group"
                >
                    <LogOut size={18} />
                    <span className="font-medium text-sm">Terminate Session</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
