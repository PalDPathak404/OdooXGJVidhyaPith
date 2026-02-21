import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ShieldCheck, ArrowRight, Briefcase, CheckCircle } from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import { motion } from 'framer-motion';

const roles = [
    {
        id: 'Administrator',
        label: 'Administrator',
        description: 'Full system access and control',
        icon: '🛡️',
    },
    {
        id: 'Fleet Manager',
        label: 'Fleet Manager',
        description: 'Manage vehicles and dispatches',
        icon: '🚛',
    },
    {
        id: 'Dispatcher',
        label: 'Dispatcher',
        description: 'Assign trips and coordinate drivers',
        icon: '📡',
    },
    {
        id: 'Safety Officer',
        label: 'Safety Officer',
        description: 'Monitor compliance and maintenance',
        icon: '⚠️',
    },
    {
        id: 'Financial Analyst',
        label: 'Financial Analyst',
        description: 'Track expenses and analytics',
        icon: '📊',
    },
];

const RoleSelect = () => {
    const navigate = useNavigate();
    const { user: clerkUser } = useUser();
    const setAuth = useFleetStore((state) => state.setAuth);

    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!selectedRole) return;
        setLoading(true);

        setAuth({
            name: clerkUser?.fullName || clerkUser?.firstName || 'Operator',
            email: clerkUser?.primaryEmailAddress?.emailAddress || '',
            role: selectedRole,
            token: 'clerk_session',
        });

        // Optionally sync role to backend
        try {
            await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: clerkUser?.fullName || 'Operator',
                    email: clerkUser?.primaryEmailAddress?.emailAddress || '',
                    role: selectedRole,
                    password: 'clerk_managed',
                }),
            });
        } catch {
            // silently ignore backend sync errors
        }

        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#0f111a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] z-10"
            >
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6">
                        <ShieldCheck size={36} className="text-white" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-widest uppercase">FleetEdge</h1>
                    <p className="text-[#8892b0] font-mono text-xs tracking-[0.2em] uppercase mt-1">Select Your Operational Role</p>
                </div>

                {/* Card */}
                <div className="bg-[#1a1d27] rounded-3xl p-8 shadow-2xl border border-white/5 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-3">
                        <p className="text-[#8892b0] text-sm text-center mb-6">
                            Welcome, <span className="text-white font-semibold">{clerkUser?.firstName || 'Operator'}</span>!
                            Choose your role to access the system.
                        </p>

                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${selectedRole === role.id
                                        ? 'border-emerald-500/60 bg-emerald-500/10'
                                        : 'border-[#2d3142] bg-[#0f111a] hover:border-[#3d4252] hover:bg-[#1a1d27]'
                                    }`}
                            >
                                <span className="text-2xl">{role.icon}</span>
                                <div className="flex-1">
                                    <p className={`font-bold text-sm ${selectedRole === role.id ? 'text-emerald-400' : 'text-white'}`}>
                                        {role.label}
                                    </p>
                                    <p className="text-[#8892b0] text-xs mt-0.5">{role.description}</p>
                                </div>
                                {selectedRole === role.id && (
                                    <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
                                )}
                            </button>
                        ))}

                        <div className="pt-4">
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedRole || loading}
                                className="w-full group relative py-4 px-6 rounded-xl bg-transparent border border-emerald-500/30 overflow-hidden transition-all hover:bg-emerald-500/10 hover:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-2">
                                    <Briefcase size={18} className="text-emerald-500" />
                                    <span className="text-emerald-500 font-bold text-sm tracking-wider group-hover:text-emerald-400 transition-colors">
                                        {loading ? 'Entering System...' : 'Confirm Role & Enter'}
                                    </span>
                                    {!loading && <ArrowRight size={18} className="text-emerald-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RoleSelect;
