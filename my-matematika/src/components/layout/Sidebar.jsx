import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logoutAdmin } from "../../lib/authClient.js";
import {
  LayoutDashboard,
  BookCopy,
  ScrollText,
  CalendarClock,
  Settings,
  X,
  LogOut,
  Globe,
  Mail,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActivePath(window.location.pathname || "");
    }
  }, []);

  useEffect(() => {
    const onToggle = () => setIsOpen((v) => !v);
    if (typeof window !== "undefined") {
      window.addEventListener("toggle-sidebar", onToggle);
      return () => window.removeEventListener("toggle-sidebar", onToggle);
    }
  }, []);

  // Struktur navigasi baru
  const navItems = [
    { icon: LayoutDashboard, text: "Dashboard", path: "/admin/dashboard/" },
    { icon: BookCopy, text: "Materi", path: "/admin/materi/" },
    {
      icon: ScrollText,
      text: "Quiz Materi",
      children: [
        { text: "Quiz", path: "/admin/quiz_materi/" },
        { text: "Participants", path: "/admin/quiz_materi/participants/" },
      ],
    },
    {
      icon: Globe,
      text: "Quiz Global",
      children: [
        { text: "Quiz", path: "/admin/quiz_global/" },
        { text: "Participants", path: "/admin/quiz_global/participants/" },
      ],
    },
    {
      icon: CalendarClock,
      text: "Quiz Event",
      children: [
        { text: "Quiz", path: "/admin/quiz_event/" },
        { text: "Participants", path: "/admin/quiz_event/participants/" },
      ],
    },
    { icon: Mail, text: "Masukan", path: "/admin/pesan/" },
    { icon: Settings, text: "Settings", path: "/admin/settings/" },
  ];

  const linkBase =
    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";

  const isActive = (path) => activePath === path;

  // Buka dropdown yang memuat halaman aktif saat pertama render
  useEffect(() => {
    const parent = navItems.find((n) =>
      n.children?.some((c) => c.path === activePath)
    );
    if (parent) setOpenDropdown(parent.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePath]);

  const handleLogout = () => {
    logoutAdmin(); // hapus token + redirect ke /admin/
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/30 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen ||
          (typeof window !== "undefined" && window.innerWidth >= 768)) && (
          <motion.aside
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="fixed md:static top-0 left-0 h-screen md:h-auto z-50 bg-white text-slate-600 w-64 flex flex-col justify-between border-r border-slate-200"
          >
            {/* Top: Logo & Nav */}
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-5 px-1">
                <a href="/admin/dashboard/" className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 7-3.6 9.4a1 1 0 0 1-1.8 0L9 7"/><path d="M6 19h12"/></svg>
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-extrabold tracking-tight text-slate-900">
                      Asyik Math
                    </span>
                    <span className="block text-[11px] font-medium text-slate-400">
                      Panel Admin
                    </span>
                  </span>
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 md:hidden"
                  aria-label="Tutup menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-0.5">
                {navItems.map(({ icon: Icon, text, path, children }) => {
                  const active =
                    isActive(path) || children?.some((c) => isActive(c.path));
                  return (
                    <div key={text}>
                      {/* item utama */}
                      <div
                        onClick={() =>
                          children
                            ? setOpenDropdown(
                                openDropdown === text ? null : text
                              )
                            : (window.location.href = path)
                        }
                        className={`${linkBase} cursor-pointer ${
                          active
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {active && (
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600"
                          />
                        )}
                        <Icon className="w-5 h-5 shrink-0" />
                        <span>{text}</span>
                        {children &&
                          (openDropdown === text ? (
                            <ChevronDown className="ml-auto w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="ml-auto w-4 h-4 text-slate-400" />
                          ))}
                      </div>

                      {/* dropdown items */}
                      <AnimatePresence>
                        {openDropdown === text && children && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="ml-4 mt-0.5 mb-1 flex flex-col gap-0.5 overflow-hidden border-l border-slate-200 pl-3"
                          >
                            {children.map((child) => (
                              <a
                                key={child.path}
                                href={child.path}
                                className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                  isActive(child.path)
                                    ? "bg-indigo-100 font-semibold text-indigo-800"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                              >
                                {child.text}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Bottom: Logout */}
            <div className="p-4 border-t border-slate-200">
              <div
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Keluar</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
