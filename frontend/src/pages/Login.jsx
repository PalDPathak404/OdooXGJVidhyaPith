import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserCircle, ArrowRight, ChevronDown, AlertCircle } from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import { motion } from 'framer-motion';

const InputField = ({ icon: Icon, placeholder, type = "text", value, onChange, ...props }) => (
    <div className="relative mb-6 group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-olive transition-colors">
            <Icon size={20} />
        </div>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full pl-12 pr-6 py-4 bg-background border border-border/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-olive/10 focus:bg-white transition-all text-softblack font-medium placeholder:text-gray-400"
            {...props}
        />
    </div>
);

const Login = () => {
    const navigate = useNavigate();
    const setAuth = useFleetStore((state) => state.setAuth);

    const [loginData, setLoginData] = useState({ email: '', password: '', role: 'Administrator' });
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
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginData.email, password: loginData.password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Login failed. Please check your credentials.');
                setLoading(false);
                return;
            }

            // Save JWT token to localStorage
            localStorage.setItem('fleet_token', data.token);

            // Set auth state with user info from DB
            setAuth({
                name: data.name,
                email: data.email,
                role: loginData.role,
                token: data.token,
            });

            navigate('/');
        } catch (err) {
            setError('Cannot reach the server. Make sure the backend is running on port 5000.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-4xl shadow-thick p-10 flex flex-col items-center border border-border/50"
            >
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-softblack tracking-tighter mb-2">FleetEdge</h1>
                    <p className="text-gray-400 font-medium tracking-wide">Assign your post to continue</p>
                </div>

                <div className="w-24 h-24 bg-background rounded-4xl flex items-center justify-center mb-10 border border-border/50 shadow-soft">
                    <UserCircle size={48} className="text-gray-300" />
                </div>

                <form onSubmit={handleLogin} className="w-full">
                    <div className="relative mb-6 group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-olive transition-colors z-10">
                            <UserCircle size={20} />
                        </div>
                        <select
                            value={loginData.role}
                            onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}
                            className="w-full pl-12 pr-10 py-4 bg-background border border-border/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-olive/10 focus:bg-white transition-all text-softblack font-bold appearance-none cursor-pointer"
                        >
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-500 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4 text-sm font-medium">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <InputField
                        icon={Mail}
                        placeholder="Email Address"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    />
                    <InputField
                        icon={Lock}
                        placeholder="Password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-4 text-xl mt-4 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                        {!loading && <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />}
                    </button>

                    <div className="text-center mt-10 space-y-4">
                        <button type="button" className="text-sm font-bold text-gray-400 hover:text-olive transition-colors underline decoration-border/0 underline-offset-4">
                            Recover password
                        </button>
                        <p className="text-sm text-gray-400 font-medium">
                            New here?{' '}
                            <Link to="/register" className="text-olive hover:underline font-bold">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
