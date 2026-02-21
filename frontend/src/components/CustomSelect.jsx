import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomSelect = ({ options, value, onChange, placeholder = "Select option", label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-2" ref={containerRef}>
            {label && <label className="text-xs font-black uppercase tracking-widest text-text-muted">{label}</label>}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 bg-surface border transition-all duration-200 ${isOpen ? 'border-primary ring-1 ring-primary/20' : 'border-border hover:border-primary/50'
                        } rounded-lg text-sm text-text-primary outline-none`}
                >
                    <span className={!selectedOption ? 'text-text-muted' : ''}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : 'text-text-muted'}`} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-2 bg-surface-elevated border border-border rounded-lg shadow-xl overflow-hidden"
                        >
                            <div className="max-h-60 overflow-y-auto py-1">
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${value === option.value
                                                ? 'bg-primary/10 text-primary font-bold'
                                                : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CustomSelect;
