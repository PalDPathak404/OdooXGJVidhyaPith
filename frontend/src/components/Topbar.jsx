import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import useFleetStore from '../store/fleetStore';

const Topbar = ({ title }) => {
    const currentUser = useFleetStore((state) => state.currentUser);

    return (
        <div className="h-20 flex items-center justify-between px-8 bg-transparent mb-4">
            <h2 className="text-2xl font-black text-softblack tracking-tight">{title}</h2>

            <div className="flex items-center gap-8">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-olive transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        className="pl-12 pr-6 py-3.5 bg-white border border-border/40 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-olive/10 w-96 transition-all font-medium placeholder:text-gray-400"
                    />
                </div>

                <button className="p-3.5 bg-white rounded-2xl shadow-soft text-gray-500 hover:text-olive hover:shadow-thick transition-all relative border border-border/40">
                    <Bell size={20} />
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-rust rounded-full ring-4 ring-white"></span>
                </button>

                <div className="flex items-center gap-4 pl-6 border-l border-border/80">
                    <div className="text-right">
                        <p className="text-sm font-black text-softblack leading-tight">{currentUser?.name || 'Guest User'}</p>
                        <p className="text-xs font-bold text-olive uppercase tracking-widest mt-0.5">{currentUser?.role || 'Observer'}</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-soft flex items-center justify-center overflow-hidden border border-border/40 group hover:shadow-thick transition-all cursor-pointer">
                        <User size={24} className="text-gray-300 group-hover:text-olive transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
