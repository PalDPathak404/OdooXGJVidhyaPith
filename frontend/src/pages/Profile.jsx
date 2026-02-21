import React from 'react';
import { User, Mail, Shield, Calendar, LogOut, Settings, Award, Clock } from 'lucide-react';
import useFleetStore from '../store/fleetStore';

const Profile = () => {
    const { currentUser, logout } = useFleetStore();

    if (!currentUser) return null;

    const stats = [
        { label: 'System Access', value: 'High Clearance', icon: Shield, color: 'text-olive' },
        { label: 'Membership', value: 'Fleet Partner', icon: Award, color: 'text-amber-500' },
        { label: 'Uptime Status', value: '100% Operational', icon: Clock, color: 'text-green-500' },
    ];

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Premium Profile Header */}
            <div className="bg-white rounded-[3rem] shadow-thick border border-border/30 overflow-hidden group">
                <div className="h-48 bg-gradient-to-r from-softblack via-charcoal to-softblack relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(163,158,137,0.5),transparent)]" />
                    <div className="absolute top-6 right-8">
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em] border border-white/20">
                            Industrial Profile
                        </span>
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
                    onClick={() => { }}
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
                    onClick={logout}
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
        </div>
    );
};

export default Profile;
