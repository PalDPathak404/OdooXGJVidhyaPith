import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserCircle, Briefcase, ArrowRight, ChevronDown } from 'lucide-react';
import useFleetStore from '../store/fleetStore';
import { motion } from 'framer-motion';

const InputField = ({ icon: Icon, placeholder, type = "text", value, onChange, ...props }) => (
    <div className="relative mb-5 group">
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

const StyledSelect = ({ icon: Icon, value, onChange, options }) => (
    <div className="relative mb-5 group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-olive transition-colors pointer-events-none z-10">
            <Icon size={20} />
        </div>
        <select
            value={value}
            onChange={onChange}
            className="w-full pl-12 pr-10 py-4 bg-background border border-border/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-olive/10 focus:bg-white transition-all text-softblack font-medium appearance-none cursor-pointer"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown size={20} />
        </div>
    </div>
);

const Register = () => {
    const navigate = useNavigate();
    const setAuth = useFleetStore((state) => state.setAuth);

    const [registerData, setRegisterData] = useState({
        fullName: '',
        email: '',
        role: 'Manager',
        password: ''
    });

    const handleRegister = (e) => {
        e.preventDefault();
        setAuth({ name: registerData.fullName, role: registerData.role });
        navigate('/');
    };

    const roleOptions = [
        { value: 'Manager', label: 'Fleet Manager' },
        { value: 'Dispatcher', label: 'Dispatcher' },
        { value: 'Safety Officer', label: 'Safety Officer' },
        { value: 'Financial Analyst', label: 'Financial Analyst' },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-4xl shadow-thick p-10 flex flex-col items-center border border-border/50"
            >
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black text-softblack tracking-tighter mb-2">FleetFlow</h1>
                    <p className="text-gray-400 font-medium">Create your corporate account</p>
                </div>

                <div className="w-20 h-20 bg-background rounded-3xl flex items-center justify-center mb-8 border border-border/50 shadow-soft">
                    <UserCircle size={40} className="text-gray-300" />
                </div>

                <form onSubmit={handleRegister} className="w-full">
                    <InputField
                        icon={User}
                        placeholder="Full Name"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                    />
                    <InputField
                        icon={Mail}
                        placeholder="Email Address"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    />

                    <StyledSelect
                        icon={Briefcase}
                        value={registerData.role}
                        onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                        options={roleOptions}
                    />

                    <InputField
                        icon={Lock}
                        placeholder="Password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    />

                    <button type="submit" className="w-full btn-primary py-4 text-lg mt-2 flex items-center justify-center gap-2 group">
                        Create Account
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="text-center mt-8">
                        <p className="text-sm text-gray-400 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-olive hover:underline font-bold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
