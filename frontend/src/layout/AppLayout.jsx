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
            '/': 'Dashboard Overview',
            '/vehicles': 'Vehicle Management',
            '/trips': 'Trip Logs',
            '/maintenance': 'Maintenance Schedules',
            '/expenses': 'Expense Tracking',
            '/drivers': 'Driver Profiles',
            '/analytics': 'Fleet Analytics',
        };
        return titles[path] || 'FleetX';
    };

    return (
        <div className="flex min-h-screen bg-background font-sans">
            <Sidebar />
            <main className="flex-1 ml-72 p-4 pb-12 overflow-x-hidden">
                <Topbar title={getTitle(location.pathname)} />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="px-8"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AppLayout;
