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
    Truck
} from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import { useAuth } from '@clerk/clerk-react';

const Sidebar = () => {
    const { signOut } = useAuth();
    const { currentUser, logout } = useFleetStore();
    const role = currentUser?.role || 'Financial Analyst';

    const allNavItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/', roles: ['Administrator', 'Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
        { name: 'Vehicles', icon: <Car size={20} />, path: '/vehicles', roles: ['Administrator', 'Fleet Manager', 'Dispatcher', 'Safety Officer'] },
        { name: 'Trips', icon: <MapPin size={20} />, path: '/trips', roles: ['Administrator', 'Fleet Manager', 'Dispatcher'] },
        { name: 'Maintenance', icon: <Wrench size={20} />, path: '/maintenance', roles: ['Administrator', 'Fleet Manager', 'Safety Officer'] },
        { name: 'Expenses', icon: <DollarSign size={20} />, path: '/expenses', roles: ['Administrator', 'Fleet Manager', 'Financial Analyst'] },
        { name: 'Drivers', icon: <Users size={20} />, path: '/drivers', roles: ['Administrator', 'Safety Officer'] },
        { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics', roles: ['Administrator', 'Financial Analyst'] },
    ];

    const navItems = allNavItems.filter(item => item.roles.includes(role));

    return (
        <div className="w-72 h-screen bg-charcoal text-white flex flex-col p-6 fixed left-0 top-0">
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="bg-olive p-2 rounded-xl">
                    <Truck size={24} className="text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">FleetX</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? 'sidebar-link-active' : 'sidebar-link'
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
                <div className="mb-4 px-3 flex flex-col">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 italic">Active Post</span>
                    <span className="text-sm font-black text-olive">{role}</span>
                </div>
                <button
                    onClick={() => {
                        logout();
                        signOut();
                    }}
                    className="sidebar-link w-full text-red-400 hover:text-red-300 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
