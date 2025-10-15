import { useState, useEffect } from "react";
import { LayoutDashboard, BookCopy, ScrollText, CalendarClock, Bolt, Menu, X} from "lucide-react";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [activePath, setActivePath] = useState(""); 

    useEffect(() => {
        setActivePath(window.location.pathname);
    }, []);

    const linkBase =
        "flex items-center gap-3 rounded-lg transition-all duration-200";
    const hover =
        "hover:bg-blue-500/40 hover:text-white hover:scale-[1.02] active:scale-100";

        const isActive = (path) => activePath === path;

    return (
        <aside
        class={`bg-blue-600 backdrop-blur-sm border-r border-blue-700 p-4 transition-all duration-300 ${
            collapsed ? "w-16" : "w-64"
        }`}
        >
            {/* HEADER */}
            <div class="flex items-center justify-between">
                <a
                href="/admin/dashboard/"
                class={`flex items-center gap-3 transition-all duration-300 ${collapsed ? "justify-center hidden" : ""}`}
                >
                <div class={`rounded-lg bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white font-bold ${collapsed ? "hidden" : "w-9 h-9"}`}>
                    A+
                </div>
                {!collapsed && (
                    <div class="text-sm font-semibold text-white">Asyik Math</div>
                )}
                </a>

                <button
                onClick={() => setCollapsed(!collapsed)}
                class={`${collapsed ? "py-2 p-0" : "p-2"} rounded-md hover:bg-blue-500/30 text-blue-100`}
                aria-label="Toggle sidebar"
                >
                {collapsed ? (
                    <X className="w-6 h-6 text-blue-100" strokeWidth={2} />       
                ) : (
                    <Menu className="w-6 h-6 text-blue-100" strokeWidth={2} />
                )}
                </button>
            </div>

            <div class="h-px w-full bg-gradient-to-r from-white/10 via-white/30 to-white/10 my-4"></div>

            {/* NAVIGATION */}
            <nav class="flex flex-col gap-1">
                {/* Dashboard */}
                <a
                href="/admin/dashboard/"
                class={`${collapsed ? "px-0 py-3" : "p-3"} ${linkBase} ${
                    isActive("/admin/dashboard/")
                    ? "bg-blue-500/70 text-white shadow-sm"
                    : "text-blue-100"
                } ${hover}`}
                >
                <LayoutDashboard className="w-5 h-5" strokeWidth={2} />
                {!collapsed && <span class="text-sm font-medium">Dashboard</span>}
                </a>

                {/* Materi */}
                <a
                href="/admin/materi/"
                class={`${collapsed ? "px-0 py-3" : "p-3"} ${linkBase} ${
                    isActive("/admin/materi/")
                    ? "bg-blue-500/70 text-white shadow-sm"
                    : "text-blue-100"
                } ${hover}`}
                >
                <BookCopy className="w-5 h-5" strokeWidth={2} />
                {!collapsed && <span class="text-sm font-medium">Materi</span>}
                </a>

                {/* Quiz */}
                <a
                href="/admin/quiz/"
                class={`${collapsed ? "px-0 py-3" : "p-3"} ${linkBase} ${
                    isActive("/admin/quiz/")
                    ? "bg-blue-500/70 text-white shadow-sm"
                    : "text-blue-100"
                } ${hover}`}
                >
                <ScrollText className="w-5 h-5" strokeWidth={2} />
                {!collapsed && <span class="text-sm font-medium">Quiz</span>}
                </a>

                {/* Event */}
                <a
                href="/admin/event/"
                class={`${collapsed ? "px-0 py-3" : "p-3"} ${linkBase} ${
                    isActive("/admin/event/")
                    ? "bg-blue-500/70 text-white shadow-sm"
                    : "text-blue-100"
                } ${hover}`}
                >
                <CalendarClock className="w-5 h-5" strokeWidth={2} />
                {!collapsed && <span class="text-sm font-medium">Quiz Event</span>}
                </a>

                {/* Settings */}
                <a
                href="/admin/settings/"
                class={`${collapsed ? "px-0 py-3" : "p-3"} ${linkBase} ${
                    isActive("/admin/settings/")
                    ? "bg-blue-500/70 text-white shadow-sm"
                    : "text-blue-100"
                } ${hover}`}
                >
                <Bolt className="w-5 h-5" strokeWidth={2} />
                {!collapsed && <span class="text-sm font-medium">Settings</span>}
                </a>
            </nav>
        </aside>
    );
}
