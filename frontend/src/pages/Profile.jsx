import React from 'react';
import { User, Mail, Shield, Calendar, LogOut, Settings, Award, Clock, Bell, Globe, Activity } from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import SideDrawer from '../components/SideDrawer';
import AccessRestricted from '../components/AccessRestricted';
import CustomSelect from '../components/CustomSelect';

const Profile = () => {
    const { currentUser, logout, settings, updateSettings } = useFleetStore();
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

    if (!currentUser) return null;

    // RBAC: Profile is usually accessible to all, but let's assume some special analytics are restricted
    const hasFullAccess = ['Administrator', 'Fleet Manager'].includes(currentUser.role);

    const stats = [
        { label: 'System Access', value: hasFullAccess ? 'Level 5 (Admin)' : 'Level 2 (User)', icon: Shield, color: 'text-primary' },
        { label: 'Membership', value: 'Fleet Partner', icon: Award, color: 'text-accent' },
        { label: 'Uptime Status', value: '100% Operational', icon: Clock, color: 'text-success' },
    ];

    const activities = [
        { type: 'Login', desc: 'Secure session established', time: '2 mins ago', icon: Activity },
        { type: 'Update', desc: 'Vehicle V-402 maintenance logged', time: '4h ago', icon: Settings },
        { type: 'Dispatch', desc: 'New trip sent to Driver Sam', time: 'Yesterday', icon: Clock },
    ];

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Premium Profile Header */}
            <div className="card-elevated overflow-hidden group">
                <div className="h-48 bg-surface-elevated relative overflow-hidden">
                    <div className="absolute top-6 right-8 flex gap-3">
                        <span className="px-4 py-2 bg-surface border border-border rounded-full text-[10px] font-black text-text-primary uppercase tracking-[0.3em]">
                            Industrial Profile
                        </span>
                        <div className="w-8 h-8 rounded-full bg-success/20 border border-success/30 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-success animate-ping" />
                        </div>
                    </div>
                </div>

                <div className="px-12 pb-12">
                    <div className="relative -mt-24 flex flex-col md:flex-row items-center md:items-end gap-8 mb-12 text-center md:text-left">
                        <div className="relative group/avatar">
                            <div className="w-48 h-48 bg-surface border-8 border-surface-elevated rounded-[2.5rem] flex items-center justify-center text-text-muted overflow-hidden transition-transform group-hover/avatar:scale-[1.02] duration-500">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                                <User size={96} strokeWidth={1} className="relative z-10 transition-colors group-hover/avatar:text-primary" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-2xl border-4 border-surface-elevated flex items-center justify-center text-text-primary">
                                <Shield size={20} />
                            </div>
                        </div>
                        <div className="pb-4 flex-1">
                            <h1 className="text-5xl font-black text-text-primary tracking-tighter mb-2">{currentUser.name}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <span className="px-4 py-1.5 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest rounded-lg border border-primary/20">
                                    {currentUser.role}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                                <span className="text-sm font-bold text-text-muted capitalize flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                    Active System Session
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="p-8 bg-surface rounded-4xl border border-border">
                                <h3 className="text-sm font-black text-text-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <div className="w-5 h-[2px] bg-primary" />
                                    Account Core Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1 border-l-2 border-border pl-4 hover:border-primary transition-colors group">
                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest group-hover:text-primary transition-colors">Email Address</p>
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} className="text-text-secondary" />
                                            <p className="font-bold text-text-primary text-lg">{currentUser.email || 'admin@fleetflow.io'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1 border-l-2 border-border pl-4 hover:border-primary transition-colors group">
                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest group-hover:text-primary transition-colors">Security Role</p>
                                        <div className="flex items-center gap-2">
                                            <Shield size={16} className="text-text-secondary" />
                                            <p className="font-bold text-text-primary text-lg">{currentUser.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity Section */}
                            <div className="p-8 bg-surface rounded-4xl border border-border">
                                <h3 className="text-sm font-black text-text-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <div className="w-5 h-[2px] bg-accent" />
                                    Security Activity Log
                                </h3>
                                <div className="space-y-4">
                                    {activities.map((act, id) => (
                                        <div key={id} className="flex items-center justify-between p-4 bg-surface-elevated rounded-2xl border border-border hover:bg-surface transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-surface rounded-xl">
                                                    <act.icon size={16} className="text-text-secondary" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-text-primary uppercase tracking-wider">{act.type}</p>
                                                    <p className="text-sm text-text-secondary font-medium">{act.desc}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black text-text-muted uppercase">{act.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-text-muted uppercase tracking-[0.2em] px-2">Operational Integrity</h3>
                            <div className="space-y-3">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-5 bg-surface-elevated rounded-3xl border border-border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl bg-surface flex items-center justify-center ${stat.color} group-hover:bg-surface group-hover:text-text-primary transition-colors`}>
                                                <stat.icon size={18} />
                                            </div>
                                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{stat.label}</span>
                                        </div>
                                        <span className="text-sm font-black text-text-primary">{stat.value}</span>
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
                    className="group relative h-24 bg-surface-elevated hover:bg-surface rounded-4xl p-1 transition-all duration-500 shadow-lg overflow-hidden border border-border"
                    onClick={() => setIsSettingsOpen(true)}
                >
                    <div className="relative h-full w-full flex items-center justify-between px-10 bg-surface-elevated group-hover:bg-surface transition-colors rounded-[2.2rem]">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Settings size={28} />
                            </div>
                            <div className="text-left">
                                <p className="text-lg font-black text-text-primary leading-none">System Settings</p>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Configure your environment</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-primary group-hover:translate-x-2 transition-transform">
                            →
                        </div>
                    </div>
                </button>

                <button
                    className="group relative h-24 bg-surface-elevated hover:bg-surface rounded-4xl p-1 transition-all duration-500 shadow-lg overflow-hidden border border-border"
                    onClick={logout}
                >
                    <div className="relative h-full w-full flex items-center justify-between px-10 bg-surface-elevated group-hover:bg-surface transition-colors rounded-[2.2rem]">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-danger/10 flex items-center justify-center text-danger group-hover:scale-110 transition-transform">
                                <LogOut size={28} />
                            </div>
                            <div className="text-left">
                                <p className="text-lg font-black text-text-primary leading-none">Secure Logout</p>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">End your session</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-primary group-hover:translate-x-2 transition-transform">
                            →
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
                    <div className="p-8 bg-surface rounded-4xl border border-border">
                        <h4 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <Settings size={14} /> Control Interfaces
                        </h4>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-2xl border border-border">
                                <div className="flex items-center gap-4">
                                    <Bell size={20} className="text-primary" />
                                    <div>
                                        <p className="text-sm font-black text-text-primary uppercase tracking-tight">System Alerts</p>
                                        <p className="text-xs text-text-muted font-bold">Push notifications for dispatches</p>
                                    </div>
                                </div>
                                <div
                                    className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${settings.notifications ? 'bg-primary' : 'bg-text-muted'}`}
                                    onClick={() => updateSettings({ notifications: !settings.notifications })}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-text-primary rounded-full transition-transform ${settings.notifications ? 'right-1' : 'left-1'}`} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-2xl border border-border">
                                <div className="flex items-center gap-4">
                                    <Globe size={20} className="text-primary" />
                                    <div>
                                        <p className="text-sm font-black text-text-primary uppercase tracking-tight">Units of Measure</p>
                                        <p className="text-xs text-text-muted font-bold">Configure system terminology</p>
                                    </div>
                                </div>
                                <div className="w-40">
                                    <CustomSelect
                                        options={[
                                            { value: 'metric', label: 'Metric (km/L)' },
                                            { value: 'imperial', label: 'Imperial (mpg)' }
                                        ]}
                                        value={settings.unitSystem}
                                        onChange={(val) => updateSettings({ unitSystem: val })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-surface-elevated rounded-4xl text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                            <Shield size={32} />
                        </div>
                        <h5 className="text-text-primary font-black uppercase tracking-widest">Protocol Active</h5>
                        <p className="text-text-muted text-xs font-medium">Your account is operating under {currentUser.role} directive. Security protocols are enforced by system kernel.</p>
                    </div>

                    <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="btn-primary w-full py-5 shadow-xl"
                    >
                        Save & Institutionalize
                    </button>
                </div>
            </SideDrawer>
        </div>
    );
};

export default Profile;
