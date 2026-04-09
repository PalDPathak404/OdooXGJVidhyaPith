import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, Mail, User, Briefcase } from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import { motion } from 'framer-motion';
import apiRequest from '../utils/api';

const Register = () => {
    const navigate = useNavigate();
    const setAuth = useFleetStore((state) => state.setAuth);

    const [registerData, setRegisterData] = useState({ fullName: '', email: '', password: '', role: 'Administrator' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const roles = [
        'Administrator',
        'Fleet Manager',
        'Dispatcher',
        'Safety Officer',
        'Financial Analyst'
    ];

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    name: registerData.fullName,
                    email: registerData.email,
                    password: registerData.password,
                    role: registerData.role
                }),
            });

            // Set initial auth state but role selection will finalize it
            setAuth({
                name: data.name,
                email: data.email,
                role: data.role,
                token: data._id // Temporary ID for sync
            });

            navigate('/select-role');
        } catch (err) {
            setError(err.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#0f111a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[420px] z-10"
            >
                {/* Header Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6 transform hover:scale-105 transition-transform">
                        <ShieldCheck size={36} className="text-white" strokeWidth={1.5} />
                    </div>
                    <div className="text-center space-y-1">
                        <h1 className="text-3xl font-black text-white tracking-widest uppercase">FleetEdge</h1>
                        <p className="text-[#8892b0] font-mono text-xs tracking-[0.2em] uppercase">Enterprise Fleet Management</p>
                    </div>
                </div>

                {/* Register Card */}
                <div className="bg-[#1a1d27] rounded-3xl p-8 shadow-2xl border border-white/5 backdrop-blur-xl relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-5">
                        <h2 className="text-xl font-bold text-white text-center mb-2">Request Access</h2>

                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8892b0] group-focus-within:text-emerald-400 transition-colors pointer-events-none">
                                    <User size={18} strokeWidth={2} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={registerData.fullName}
                                    onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-[#0f111a] border border-[#2d3142] rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-white placeholder:text-[#5c637a] text-sm"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8892b0] group-focus-within:text-emerald-400 transition-colors pointer-events-none">
                                    <Mail size={18} strokeWidth={2} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Operator Email"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-[#0f111a] border border-[#2d3142] rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-white placeholder:text-[#5c637a] text-sm"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8892b0] group-focus-within:text-emerald-400 transition-colors pointer-events-none">
                                    <Lock size={18} strokeWidth={2} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Security Code"
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-[#0f111a] border border-[#2d3142] rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-white placeholder:text-[#5c637a] text-sm tracking-widest"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <select
                                    value={registerData.role}
                                    onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                                    className="w-full px-4 py-4 bg-[#0f111a] border border-emerald-500/30 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white appearance-none cursor-pointer text-sm font-medium hover:border-emerald-500/50"
                                >
                                    {roles.map(role => (
                                        <option key={role} value={role} className="bg-[#1a1d27] py-2">{role}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8892b0] pointer-events-none">
                                    <Briefcase size={18} />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full group relative py-4 px-6 rounded-xl bg-transparent border border-emerald-500/30 overflow-hidden transition-all hover:bg-emerald-500/10 hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-2">
                                        <span className="text-emerald-500 font-bold text-sm tracking-wider group-hover:text-emerald-400 transition-colors">
                                            {loading ? 'Processing...' : 'Request Access'}
                                        </span>
                                        {!loading && <ArrowRight size={18} className="text-emerald-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />}
                                    </div>
                                </button>
                            </div>

                            <div className="text-center pt-4">
                                <p className="text-sm font-medium text-[#8892b0]">
                                    Already have clearance?{' '}
                                    <Link to="/login" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">
                                        System Access
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
