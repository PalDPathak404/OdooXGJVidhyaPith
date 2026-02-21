import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';
import { UserCircle, Lock, MonitorSmartphone, ArrowRight, ShieldCheck, User } from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import { motion } from 'framer-motion';

const Login = () => {
    const navigate = useNavigate();
    const { isLoaded, signIn, setActive } = useSignIn();
    const setAuth = useFleetStore((state) => state.setAuth);

    const [loginData, setLoginData] = useState({ operatorId: '', password: '', role: 'Administrator' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const roles = [
        'Administrator',
        'Fleet Manager',
        'Dispatcher',
        'Safety Officer',
        'Financial Analyst'
    ];

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!isLoaded) return;
            const clerkAttempt = await signIn.create({
                identifier: loginData.operatorId,
                password: loginData.password,
            });

            if (clerkAttempt.status === 'complete') {
                await setActive({ session: clerkAttempt.createdSessionId });

                // Try to sync with backend
                try {
                    const res = await fetch('http://localhost:5000/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: loginData.operatorId }),
                    });

                    if (res.ok) {
                        const data = await res.json();
                        setAuth({
                            name: data.name,
                            email: data.email,
                            role: data.role,
                            token: clerkAttempt.createdSessionId
                        });
                    } else {
                        throw new Error('Fallback role sync');
                    }
                } catch (backendErr) {
                    setAuth({
                        name: "Operator",
                        email: loginData.operatorId,
                        role: loginData.role,
                        token: clerkAttempt.createdSessionId,
                    });
                }

                navigate('/');
            } else {
                setError('Additional verification needed.');
                console.log(clerkAttempt);
            }
        } catch (err) {
            setError(err.errors ? err.errors[0].longMessage : 'Cannot reach the server. Login failed.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        try {
            if (!isLoaded) return;
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/'
            });
        } catch (err) {
            setError('Google authentication failed. Please try again.');
            console.error(err);
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
                {/* Header Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6 transform hover:scale-105 transition-transform">
                        <ShieldCheck size={36} className="text-white" strokeWidth={1.5} />
                    </div>
                    <div className="text-center space-y-1">
                        <h1 className="text-3xl font-black text-white tracking-widest uppercase">
                            FleetEdge
                        </h1>
                        <p className="text-[#8892b0] font-mono text-xs tracking-[0.2em] uppercase">
                            Enterprise Fleet Management
                        </p>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] text-emerald-400 font-bold tracking-wider">SYSTEM ONLINE</span>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-[#1a1d27] rounded-3xl p-8 shadow-2xl border border-white/5 backdrop-blur-xl relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-5">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleGoogleAuth}
                            className="w-full group py-3 px-4 rounded-xl bg-[#2d3142] hover:bg-[#3b4055] border border-white/5 transition-all flex items-center justify-center gap-3 shadow-soft"
                            type="button"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="text-white text-sm font-bold tracking-wide">Continue with Google</span>
                        </button>

                        <div className="flex items-center gap-3 opacity-50 py-2">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white" />
                            <span className="text-xs font-medium text-white tracking-widest uppercase">OR OPERATOR ID</span>
                            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white" />
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Custom Input Field: Operator ID */}
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8892b0] group-focus-within:text-emerald-400 transition-colors pointer-events-none">
                                    <User size={18} strokeWidth={2} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Operator ID"
                                    value={loginData.operatorId}
                                    onChange={(e) => setLoginData({ ...loginData, operatorId: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-[#0f111a] border border-[#2d3142] rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-white placeholder:text-[#5c637a] text-sm"
                                    required
                                />
                            </div>

                            {/* Custom Input Field: Security Code */}
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8892b0] group-focus-within:text-emerald-400 transition-colors pointer-events-none">
                                    <Lock size={18} strokeWidth={2} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Security Code"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-[#0f111a] border border-[#2d3142] rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-white placeholder:text-[#5c637a] text-sm tracking-widest"
                                    required
                                />
                            </div>

                            {/* Role Select Dropdown */}
                            <div className="relative group">
                                <select
                                    value={loginData.role}
                                    onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}
                                    className="w-full px-4 py-4 bg-[#0f111a] border border-emerald-500/30 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white appearance-none cursor-pointer text-sm font-medium hover:border-emerald-500/50"
                                >
                                    {roles.map(role => (
                                        <option key={role} value={role} className="bg-[#1a1d27] py-2">{role}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8892b0] pointer-events-none">
                                    <UserCircle size={18} />
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
                                            {loading ? 'Authenticating...' : 'Access Command System'}
                                        </span>
                                        {!loading && <ArrowRight size={18} className="text-emerald-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />}
                                    </div>
                                </button>
                            </div>

                            <div className="text-center pt-4">
                                <p className="text-sm font-medium text-[#8892b0]">
                                    New operator?{' '}
                                    <Link to="/register" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">
                                        Request Access
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

export default Login;
