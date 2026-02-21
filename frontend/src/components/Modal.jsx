import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-softblack/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none p-6"
                    >
                        <div className="bg-white w-full max-w-lg rounded-4xl shadow-thick pointer-events-auto overflow-hidden border border-border/50">
                            <div className="px-8 py-6 border-b border-border/30 flex items-center justify-between bg-white">
                                <h2 className="text-xl font-black text-softblack">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-background rounded-xl transition-colors text-gray-400 hover:text-softblack"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 max-h-[80vh] overflow-y-auto">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;
