// src/components/layout/Sidebar.jsx
import { useState } from "react";
// import { Link } from "@astrojs/preact/client";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside class={`bg-white/70 backdrop-blur-sm border-r border-gray-100 p-4 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
        <div class="flex items-center justify-between mb-6">
            <a href="/admin/dashboard/dashboard" class={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">A+</div>
                {!collapsed && <div class="text-sm font-semibold">Asyik Math</div>}
            </a>

            <button
            onClick={() => setCollapsed(!collapsed)}
            class="p-2 rounded-md hover:bg-slate-100"
            aria-label="Toggle sidebar"
            >
            <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={collapsed ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
            </button>
        </div>

        <nav class="flex flex-col gap-1">
            <a href="/admin/dashboard" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50">
            <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 13h8V3H3v10zM13 21h8V11h-8v10zM13 3v4" /></svg>
            {!collapsed && <span class="text-sm font-medium">Dashboard</span>}
            </a>

            <a href="/admin/materi" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50">
            <svg class="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20v-6" /></svg>
            {!collapsed && <span class="text-sm font-medium">Materi</span>}
            </a>

            <a href="/admin/quiz" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50">
            <svg class="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 6h13M8 12h13M8 18h13" /></svg>
            {!collapsed && <span class="text-sm font-medium">Quiz</span>}
            </a>

            <a href="/admin/event" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50">
            <svg class="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7 10l5 5 5-5" /></svg>
            {!collapsed && <span class="text-sm font-medium">Quiz Event</span>}
            </a>

            <a href="/admin/settings" class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 mt-4">
            <svg class="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 15l9-5-9-5-9 5 9 5z"/></svg>
            {!collapsed && <span class="text-sm font-medium">Settings</span>}
            </a>
        </nav>
        </aside>
    );
}
