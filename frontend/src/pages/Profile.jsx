import React from 'react';
import { User, Mail, Shield, Calendar, LogOut, Settings, Award, Clock, Bell, Globe, Activity } from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import SideDrawer from '../components/SideDrawer';
import AccessRestricted from '../components/AccessRestricted';
import { useAuth } from '@clerk/clerk-react';

const Profile = () => {
    const { signOut } = useAuth();
    const { currentUser, logout, settings, updateSettings } = useFleetStore();
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

    if (!currentUser) return null;

    // RBAC: Profile is usually accessible to all, but let's assume some special analytics are restricted
    const hasFullAccess = ['Administrator', 'Fleet Manager'].includes(currentUser.role);

    const stats = [
        { label: 'System Access', value: hasFullAccess ? 'Level 5 (Admin)' : 'Level 2 (User)', icon: Shield, color: 'text-olive' },
        { label: 'Membership', value: 'Fleet Partner', icon: Award, color: 'text-amber-500' },
        { label: 'Uptime Status', value: '100% Operational', icon: Clock, color: 'text-green-500' },
    ];

    const activities = [
        { type: 'Login', desc: 'Secure session established', time: '2 mins ago', icon: Activity },
        { type: 'Update', desc: 'Vehicle V-402 maintenance logged', time: '4h ago', icon: Settings },
        { type: 'Dispatch', desc: 'New trip sent to Driver Sam', time: 'Yesterday', icon: Clock },
    ];

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Premium Profile Header */}
            <div className="bg-white rounded-[3rem] shadow-thick border border-border/30 overflow-hidden group">
                <div className="h-48 bg-softblack relative overflow-hidden">
                    {/* Animated industrial background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-softblack to-olive/20 animate-pulse duration-[10s]" />
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(163,158,137,0.5),transparent)]" />

                    <div className="absolute top-6 right-8 flex gap-3">
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em] border border-white/20">
                            Industrial Profile
                        </span>
                        <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                        </div>
                    </div>
                </div>

                <div className="px-12 pb-12">
                    <div className="relative -mt-24 flex flex-col md:flex-row items-center md:items-end gap-8 mb-12 text-center md:text-left">
                        <div className="relative group/avatar">
                            <div className="w-48 h-48 bg-background rounded-[2.5rem] border-8 border-white shadow-thick flex items-center justify-center text-gray-300 overflow-hidden transition-transform group-hover/avatar:scale-[1.02] duration-500">
                                <div className="absolute inset-0 bg-olive/5 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                                <User size={96} strokeWidth={1} className="relative z-10 transition-colors group-hover/avatar:text-olive" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-olive rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-soft">
                                <Shield size={20} />
                            </div>
                        </div>
                        <div className="pb-4 flex-1">
                            <h1 className="text-5xl font-black text-softblack tracking-tighter mb-2">{currentUser.name}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <span className="px-4 py-1.5 bg-olive/10 text-olive text-[11px] font-black uppercase tracking-widest rounded-lg border border-olive/20">
                                    {currentUser.role}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                                <span className="text-sm font-bold text-gray-400 capitalize flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Active System Session
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="p-8 bg-background/50 rounded-4xl border border-border/20">
                                <h3 className="text-sm font-black text-softblack/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <div className="w-5 h-[2px] bg-olive" />
                                    Account Core Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1 border-l-2 border-border/40 pl-4 hover:border-olive transition-colors group">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-olive transition-colors">Email Address</p>
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} className="text-gray-300" />
                                            <p className="font-bold text-softblack text-lg">{currentUser.email || 'admin@fleetflow.io'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1 border-l-2 border-border/40 pl-4 hover:border-olive transition-colors group">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-olive transition-colors">Security Role</p>
                                        <div className="flex items-center gap-2">
                                            <Shield size={16} className="text-gray-300" />
                                            <p className="font-bold text-softblack text-lg">{currentUser.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* [NEW] Recent Activity Unique Feature */}
                            <div className="p-8 bg-background/30 rounded-4xl border border-border/10">
                                <h3 className="text-sm font-black text-softblack/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <div className="w-5 h-[2px] bg-charcoal" />
                                    Security Activity Log
                                </h3>
                                <div className="space-y-4">
                                    {activities.map((act, id) => (
                                        <div key={id} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-border/5 hover:bg-white transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-white rounded-xl shadow-soft">
                                                    <act.icon size={16} className="text-charcoal" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-softblack uppercase tracking-wider">{act.type}</p>
                                                    <p className="text-sm text-gray-500 font-medium">{act.desc}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase">{act.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-softblack/40 uppercase tracking-[0.2em] px-2">Operational Integrity</h3>
                            <div className="space-y-3">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-border/30 shadow-soft hover:shadow-thick hover:-translate-y-1 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl bg-background flex items-center justify-center ${stat.color} group-hover:bg-softblack group-hover:text-white transition-colors`}>
                                                <stat.icon size={18} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</span>
                                        </div>
                                        <span className="text-sm font-black text-softblack">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    className="group relative h-24 bg-softblack hover:bg-black rounded-4xl p-1 transition-all duration-500 shadow-thick overflow-hidden"
                    onClick={() => setIsSettingsOpen(true)}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-olive/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative h-full w-full flex items-center justify-between px-10 bg-softblack group-hover:bg-transparent transition-colors rounded-[2.2rem]">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                <Settings size={28} />
                            </div>
                            <div className="text-left">
                                <p className="text-lg font-black text-white leading-none">System Settings</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Configure your environment</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:translate-x-2 transition-transform">
                            →
                        </div>
                    </div>
                </button>

                <button
                    className="group relative h-24 bg-white border border-rust/30 rounded-4xl p-1 transition-all duration-500 shadow-soft hover:shadow-thick overflow-hidden"
                    onClick={() => {
                        logout();
                        signOut();
                    }}
                >
                    <div className="absolute inset-0 bg-rust/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative h-full w-full flex items-center justify-between px-10 bg-white rounded-[2.2rem]">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-rust/10 flex items-center justify-center text-rust group-hover:scale-110 transition-transform">
                                <LogOut size={28} />
                            </div>
                            <div className="text-left">
                                <p className="text-lg font-black text-rust leading-none">Terminate Session</p>
                                <p className="text-xs font-bold text-rust/40 uppercase tracking-widest mt-1">Secure logout from system</p>
                            </div>
                        </div>
                    </div>
                </button>
            </div>

            {/* System Settings Drawer */}
            <SideDrawer
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                title="Industrial System Preferences"
            >
                <div className="space-y-10 py-4">
                    <div className="p-8 bg-background/50 rounded-4xl border border-border/20">
                        <h4 className="text-xs font-black text-softblack uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <Settings size={14} /> Control Interfaces
                        </h4>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-border/30">
                                <div className="flex items-center gap-4">
                                    <Bell size={20} className="text-olive" />
                                    <div>
                                        <p className="text-sm font-black text-softblack uppercase tracking-tight">System Alerts</p>
                                        <p className="text-xs text-gray-400 font-bold">Push notifications for dispatches</p>
                                    </div>
                                </div>
                                <div
                                    className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${settings.notifications ? 'bg-olive' : 'bg-gray-300'}`}
                                    onClick={() => updateSettings({ notifications: !settings.notifications })}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.notifications ? 'right-1' : 'left-1'}`} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-border/30">
                                <div className="flex items-center gap-4">
                                    <Globe size={20} className="text-olive" />
                                    <div>
                                        <p className="text-sm font-black text-softblack uppercase tracking-tight">Units of Measure</p>
                                        <p className="text-xs text-gray-400 font-bold">Current: {settings.unitSystem === 'metric' ? 'Metric (km)' : 'Imperial (mi)'}</p>
                                    </div>
                                </div>
                                <select
                                    className="bg-transparent text-sm font-black text-olive focus:outline-none cursor-pointer"
                                    value={settings.unitSystem}
                                    onChange={(e) => updateSettings({ unitSystem: e.target.value })}
                                >
                                    <option value="metric">Metric</option>
                                    <option value="imperial">Imperial</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-softblack rounded-4xl text-center space-y-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-white">
                            <Shield size={32} />
                        </div>
                        <h5 className="text-white font-black uppercase tracking-widest">Protocol Active</h5>
                        <p className="text-gray-500 text-xs font-medium">Your account is operating under {currentUser.role} directive. Security protocols are enforced by system kernel.</p>
                    </div>

                    <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="btn-primary w-full py-5 shadow-thick"
                    >
                        Save & Institutionalize
                    </button>
                </div>
            </SideDrawer>
        </div>
    );
};

export default Profile;
