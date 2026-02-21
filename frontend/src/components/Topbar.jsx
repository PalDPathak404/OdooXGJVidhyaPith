import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import useFleetStore from '../store/fleetStore';

const Topbar = ({ title }) => {
    const currentUser = useFleetStore((state) => state.currentUser);

    return (
        <header className="flex items-center justify-between mb-10 px-8 py-2">
            <div>
                <h2 className="text-3xl font-black text-softblack tracking-tight">{title}</h2>
                <p className="text-gray-400 font-medium text-sm mt-1">
                    System active • <span className="text-olive font-bold">Operational</span>
                </p>
            </div>

            <Link to="/profile" className="flex items-center gap-6 group hover:opacity-80 transition-all cursor-pointer">
                <div className="flex flex-col items-end">
                    <span className="font-bold text-softblack group-hover:text-olive transition-colors">{currentUser?.name || 'Guest'}</span>
                    <span className="text-[10px] font-black text-olive uppercase tracking-widest">{currentUser?.role || 'Observer'}</span>
                </div>
                <div className="w-12 h-12 bg-white rounded-2xl border border-border/40 shadow-soft flex items-center justify-center text-gray-300 overflow-hidden group-hover:border-olive/30 group-hover:shadow-thick transition-all">
                    <UserCircle size={24} className="group-hover:text-olive transition-colors" />
                </div>
            </Link>
        </header>
    );
};

export default Topbar;
