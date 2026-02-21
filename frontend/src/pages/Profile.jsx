import React from 'react';
import { User, Mail, Shield, Calendar, LogOut, Settings } from 'lucide-react';
import useFleetStore from '../store/fleetStore';

const Profile = () => {
    const { currentUser, logout } = useFleetStore();

    if (!currentUser) return null;

    const stats = [
        { label: 'System Access', value: 'High Clearance', icon: Shield },
        { label: 'Membership', value: 'Fleet Partner', icon: Calendar },
        { label: 'Account Type', value: 'Operational', icon: User },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Profile Header */}
            <div className="bg-white rounded-4xl shadow-thick border border-border/30 overflow-hidden">
                <div className="h-32 bg-softblack relative" />
                <div className="px-10 pb-10">
                    <div className="relative -mt-16 flex items-end gap-6 mb-6">
                        <div className="w-32 h-32 bg-background rounded-3xl border-4 border-white shadow-soft flex items-center justify-center text-gray-300 overflow-hidden">
                            <User size={64} strokeWidth={1.5} />
                        </div>
                        <div className="pb-4">
                            <h1 className="text-4xl font-black text-softblack tracking-tight">{currentUser.name}</h1>
                            <span className="text-xs font-black text-olive uppercase tracking-[0.2em]">{currentUser.role}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-softblack border-b border-border/20 pb-2">Account Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-gray-400 group-hover:text-olive transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                                        <p className="font-bold text-softblack">{currentUser.email || 'not_set@fleetflow.com'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-gray-400 group-hover:text-olive transition-colors">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Role</p>
                                        <p className="font-bold text-softblack">{currentUser.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-softblack border-b border-border/20 pb-2">Operational Stats</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border/40 hover:border-olive/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <stat.icon size={18} className="text-gray-400" />
                                            <span className="text-sm font-bold text-softblack/60">{stat.label}</span>
                                        </div>
                                        <span className="text-sm font-black text-softblack">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    className="flex-1 btn-primary py-5 px-8 flex items-center justify-center gap-3 bg-softblack hover:bg-black font-black text-lg shadow-thick"
                    onClick={() => { }}
                >
                    <Settings size={22} />
                    Account Settings
                </button>
                <button
                    className="flex-1 bg-white border border-rust/30 text-rust py-5 px-8 rounded-3xl flex items-center justify-center gap-3 font-black text-lg shadow-soft hover:bg-rust/5 transition-all"
                    onClick={logout}
                >
                    <LogOut size={22} />
                    Terminal Sign Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
