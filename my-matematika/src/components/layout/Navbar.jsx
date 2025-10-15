// src/components/layout/Navbar.jsx
import { useState, useEffect } from "react";
import { getCurrentUser } from "../../lib/firebaseConfig";
import { UserCircle2 } from "lucide-react"; // icon admin abu-abu

export default function Navbar() {
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const u = getCurrentUser ? getCurrentUser() : null;
        if (u) setUserEmail(u.email);
    }, []);

    return (
        <header className="px-6 w-full border-b border-gray-100 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto px-4 py-3 flex items-center justify-between">
            {/* Kiri: Judul halaman */}
            <div className="flex items-center gap-4">
            <button
                id="sidebar-open"
                className="md:hidden p-2 rounded-md hover:bg-slate-100"
                aria-label="Open menu"
            >
                <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                >
                <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <div className="text-sm text-slate-600 font-medium">Dashboard</div>
            </div>
    
            {/* Kanan: Info admin */}
            <div className="flex items-center gap-3">
            <div className="text-right">
                <div className="text-sm font-medium text-slate-700">
                {userEmail ?? "admin@email.com"}
                </div>
                <div className="text-xs text-green-600 font-semibold">Active</div>
            </div>
            <UserCircle2 className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
            </div>
        </div>
        </header>
    );
}