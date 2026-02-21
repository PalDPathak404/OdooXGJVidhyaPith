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
                        className="fixed inset-0 bg-softblack/20 backdrop-blur-md z-50 transition-all duration-500"
                    />

                    {/* Drawer Content */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-[60] shadow-2xl border-l border-border/20 flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-10 py-8 border-b border-border/10 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                            <div>
                                <h2 className="text-2xl font-black text-softblack tracking-tight">{title}</h2>
                                <div className="h-1 w-12 bg-olive rounded-full mt-2" />
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-background rounded-2xl transition-all hover:rotate-90 text-gray-400 hover:text-softblack active:scale-95 border border-transparent hover:border-border/40"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
                                {children}
                            </div>
                        </div>

                        {/* Footer decorative element */}
                        <div className="p-8 border-t border-border/10">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] text-center">
                                Fleet Flow • Industrial Transit System
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SideDrawer;
