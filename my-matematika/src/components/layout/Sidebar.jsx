import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    BookCopy,
    ScrollText,
    CalendarClock,
    Bolt,
    X,
    Menu as IconMenu,
    } from "lucide-react";

    export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false); // mobile open state
    const [collapsed, setCollapsed] = useState(false); // desktop collapse (if you keep that)
    const [activePath, setActivePath] = useState("");

    useEffect(() => {
        setActivePath(window.location.pathname || "");
    }, []);

    useEffect(() => {
        const onToggle = () => setIsOpen((v) => !v);
        window.addEventListener("toggle-sidebar", onToggle);
        return () => window.removeEventListener("toggle-sidebar", onToggle);
    }, []);

    // close sidebar on route change (helpful)
    useEffect(() => {
        const onNav = () => setIsOpen(false);
        window.addEventListener("popstate", onNav);
        return () => window.removeEventListener("popstate", onNav);
    }, []);

    const linkBase = "flex items-center gap-3 rounded-lg transition-all duration-200";
    const hover = "hover:bg-blue-500/40 hover:text-white hover:scale-[1.02] active:scale-100";
    const isActive = (path) => activePath === path;

    return (
        <>
        {/* Overlay only on mobile when open */}
        {isOpen && (
            <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            />
        )}

        <aside
            className={`fixed md:static top-0 left-0 h-screen md:h-auto z-50 transform transition-transform duration-300
                bg-blue-600 text-white border-r border-blue-700 p-4
                w-64 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
            <div className="flex items-center justify-between mb-4">
            <a href="/admin/dashboard/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center font-bold text-white">
                A+
                </div>
                <span className="font-semibold text-sm md:block hidden">Asyik Math</span>
            </a>

            {/* mobile only close */}
            <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md hover:bg-blue-500/30 text-blue-100 md:hidden"
                aria-label="Close sidebar"
            >
                <X className="w-6 h-6" />
            </button>
            </div>

            <div className="h-px w-full bg-white/20 my-4"></div>

            <nav className="flex flex-col gap-1">
            <a
                href="/admin/dashboard/"
                className={`${linkBase} ${hover} ${
                isActive("/admin/dashboard/") ? "bg-blue-500/70 text-white shadow-sm" : "text-blue-100"
                } p-3`}
            >
                <LayoutDashboard className="w-5 h-5" />
                <span className="text-sm font-medium">Dashboard</span>
            </a>

            <a
                href="/admin/materi/"
                className={`${linkBase} ${hover} ${
                isActive("/admin/materi/") ? "bg-blue-500/70 text-white shadow-sm" : "text-blue-100"
                } p-3`}
            >
                <BookCopy className="w-5 h-5" />
                <span className="text-sm font-medium">Materi</span>
            </a>

            <a
                href="/admin/quiz/"
                className={`${linkBase} ${hover} ${
                isActive("/admin/quiz/") ? "bg-blue-500/70 text-white shadow-sm" : "text-blue-100"
                } p-3`}
            >
                <ScrollText className="w-5 h-5" />
                <span className="text-sm font-medium">Quiz</span>
            </a>

            <a
                href="/admin/event/"
                className={`${linkBase} ${hover} ${
                isActive("/admin/event/") ? "bg-blue-500/70 text-white shadow-sm" : "text-blue-100"
                } p-3`}
            >
                <CalendarClock className="w-5 h-5" />
                <span className="text-sm font-medium">Quiz Event</span>
            </a>

            <a
                href="/admin/settings/"
                className={`${linkBase} ${hover} ${
                isActive("/admin/settings/") ? "bg-blue-500/70 text-white shadow-sm" : "text-blue-100"
                } p-3`}
            >
                <Bolt className="w-5 h-5" />
                <span className="text-sm font-medium">Settings</span>
            </a>
            </nav>
        </aside>
        </>
    );
}
