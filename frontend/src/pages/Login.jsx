import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, UserCircle, ArrowRight, Shield, Radar } from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import { motion } from 'framer-motion';

const InputField = ({ icon: Icon, placeholder, type = "text", value, onChange, ...props }) => (
    <div className="relative mb-6 group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
            <Icon size={20} />
        </div>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="input-field pl-12 pr-4"
            {...props}
        />
    </div>
);

const Login = () => {
    const navigate = useNavigate();
    const setAuth = useFleetStore((state) => state.setAuth);

    const [loginData, setLoginData] = useState({ username: '', password: '', role: 'Administrator' });

    const roles = [
        'Administrator',
        'Fleet Manager',
        'Dispatcher',
        'Safety Officer',
        'Financial Analyst'
    ];

    const handleLogin = (e) => {
        e.preventDefault();
        setAuth({
            name: loginData.username || 'Commander',
            role: loginData.role,
            id: `OP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        });
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_var(--color-border)_1px,_transparent_1px)] [background-size:32px_32px] opacity-20"></div>
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-alt rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Shield size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">FLEETEDGE</h1>
                    <p className="text-text-secondary font-mono text-sm">Enterprise Fleet Management</p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <Radar size={14} className="text-success" />
                        <span className="text-xs text-success font-mono">SYSTEM ONLINE</span>
                    </div>
                </div>

                {/* Login Form */}
                <div className="card-elevated p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <InputField
                            icon={User}
                            placeholder="Operator ID"
                            value={loginData.username}
                            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                            required
                        />

                        <InputField
                            icon={Lock}
                            type="password"
                            placeholder="Security Code"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            required
                        />

                        <div className="relative">
                            <select
                                value={loginData.role}
                                onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}
                                className="input-field appearance-none pl-4 pr-10 cursor-pointer"
                            >
                                {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                            <UserCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>

                        <button
                            type="submit"
                            className="w-full px-6 py-4 bg-surface-elevated border-2 border-primary text-primary font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 group"
                        >
                            <span className="text-lg">Access Command System</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-text-secondary text-sm">
                            New operator?{' '}
                            <Link to="/register" className="text-primary hover:text-primary-alt transition-colors font-medium">
                                Request Access
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
