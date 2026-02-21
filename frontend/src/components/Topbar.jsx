import { Link } from 'react-router-dom';
import { UserCircle, Settings, Activity, Clock } from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import ThemeToggle from './ThemeToggle';
import NotificationCenter from './NotificationCenter';

const Topbar = ({ title }) => {
    const currentUser = useFleetStore((state) => state.currentUser);
    const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });

    return (
        <header className="bg-surface border-b border-border px-8 py-4">
            <div className="flex items-center justify-between">
                {/* Left Section - Title and Status */}
                <div className="flex items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-3">
                            {title}
                            <div className="flex items-center gap-2 px-2 py-1 bg-success/20 rounded-full">
                                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                                <span className="text-xs text-success font-mono font-semibold">LIVE</span>
                            </div>
                        </h2>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2 text-text-secondary">
                                <Activity size={14} className="text-primary" />
                                <span className="text-sm font-mono">All Systems Operational</span>
                            </div>
                            <div className="flex items-center gap-2 text-text-secondary">
                                <Clock size={14} />
                                <span className="text-sm font-mono">{currentTime} UTC</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - User and Actions */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <ThemeToggle />
                    
                    {/* Notification Center */}
                    <NotificationCenter />
                    
                    {/* Settings */}
                    <Link 
                        to="/profile" 
                        className="p-2 text-text-secondary hover:text-primary hover:bg-surface-elevated rounded-lg transition-all duration-200 flex items-center gap-2"
                        title="System Settings"
                    >
                        <Settings size={20} />
                        <span className="text-xs font-medium">Settings</span>
                    </Link>

                    {/* User Profile */}
                    <Link 
                        to="/profile" 
                        className="flex items-center gap-4 group hover:bg-surface-elevated px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                        <div className="flex flex-col items-end">
                            <span className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                                {currentUser?.name || 'Guest Operator'}
                            </span>
                            <span className="text-xs text-text-muted font-mono uppercase tracking-wider">
                                {currentUser?.role || 'Observer'}
                            </span>
                        </div>
                        <div className="relative">
                            <div className="w-10 h-10 bg-surface-elevated border border-border rounded-lg flex items-center justify-center overflow-hidden group-hover:border-primary transition-all">
                                <UserCircle size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-surface"></div>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
