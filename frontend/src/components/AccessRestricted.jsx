import React from 'react';
import { ShieldAlert } from 'lucide-react';

const AccessRestricted = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-rust/10 rounded-full flex items-center justify-center text-rust animate-pulse">
                <ShieldAlert size={48} strokeWidth={2.5} />
            </div>
            <div className="text-center">
                <h1 className="text-4xl font-black text-softblack tracking-tight">Access Restricted</h1>
                <p className="text-gray-400 font-medium mt-2 max-w-md mx-auto">
                    Your current role does not have permission to view this section.
                    Please contact your system administrator for higher clearance.
                </p>
            </div>
            <button
                onClick={() => window.location.href = '/'}
                className="btn-primary py-4 px-10 font-black shadow-thick bg-softblack hover:bg-black"
            >
                Return to Dashboard
            </button>
        </div>
    );
};

export default AccessRestricted;
