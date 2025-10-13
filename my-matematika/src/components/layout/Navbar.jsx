// src/components/layout/Navbar.jsx
import { useState, useEffect } from "react";
import { auth, signOut, getCurrentUser } from "../../lib/firebaseConfig";

export default function Navbar() {
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        // try snapshot from getCurrentUser
        const u = getCurrentUser ? getCurrentUser() : null;
        if (u) setUserEmail(u.email);
    }, []);

    const handleLogout = async () => {
        try {
        await signOut(auth);
        window.location.href = "/admin";
        } catch (err) {
        console.error("Logout gagal", err);
        }
    };

    return (
        <header class="w-full border-b border-gray-100 bg-white/60 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-4">
            <button id="sidebar-open" class="md:hidden p-2 rounded-md hover:bg-slate-100" aria-label="Open menu">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div class="text-sm text-slate-600">Dashboard</div>
            </div>

            <div class="flex items-center gap-3">
            <div class="text-sm text-slate-600 hidden sm:block">{userEmail ?? "Admin"}</div>
            <button onClick={handleLogout} class="px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700">Logout</button>
            </div>
        </div>
        </header>
    );
}
