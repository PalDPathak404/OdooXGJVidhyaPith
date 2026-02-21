import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { motion, AnimatePresence } from 'framer-motion';

const AppLayout = ({ children }) => {
    const location = useLocation();

    // Map paths to titles
    const getTitle = (path) => {
        const titles = {
            '/': 'Command Center',
            '/vehicles': 'Fleet Asset Management',
            '/trips': 'Mission Control',
            '/maintenance': 'Maintenance Bay',
            '/expenses': 'Financial Hub',
            '/drivers': 'Personnel Management',
            '/analytics': 'Fleet Analytics',
        };
        return titles[path] || 'FLEETEDGE';
    };

    return (
        <div className="flex min-h-screen bg-background font-sans">
            <Sidebar />
            <main className="flex-1 ml-80 p-0 overflow-x-hidden">
                <Topbar title={getTitle(location.pathname)} />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="px-8 py-6"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AppLayout;
