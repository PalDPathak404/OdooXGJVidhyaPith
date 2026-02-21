import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SideDrawer = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 transition-all duration-300"
                    />

                    {/* Drawer Content */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-xl bg-surface z-[60] shadow-2xl border-l border-border flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-surface-elevated sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-text-primary tracking-tight">{title}</h2>
                                <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full mt-2" />
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-surface rounded-lg transition-all hover:rotate-90 text-text-muted hover:text-text-primary active:scale-95 border border-transparent hover:border-border"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
                                {children}
                            </div>
                        </div>

                        {/* Footer decorative element */}
                        <div className="p-6 border-t border-border bg-surface-elevated">
                            <p className="text-xs text-text-muted font-mono uppercase tracking-widest text-center">
                                FLEETEDGE • Enterprise Fleet v2.0
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SideDrawer;
