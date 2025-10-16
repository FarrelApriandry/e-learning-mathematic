import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, signOut } from "../../lib/firebaseConfig";
import {
  LayoutDashboard,
  BookCopy,
  ScrollText,
  CalendarClock,
  Bolt,
  X,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState("");

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

  const navItems = [
    { icon: LayoutDashboard, text: "Dashboard", path: "/admin/dashboard/" },
    { icon: BookCopy, text: "Materi", path: "/admin/materi/" },
    { icon: ScrollText, text: "Quiz", path: "/admin/quiz/" },
    { icon: CalendarClock, text: "Quiz Event", path: "/admin/event/" },
    { icon: Bolt, text: "Settings", path: "/admin/settings/" },
  ];

  const linkBase =
    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300";
  const hover =
    "hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:translate-x-1 hover:shadow-lg";

  const isActive = (path) => activePath === path;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("[Auth] User logged out successfully");
      window.location.href = "/admin"; // redirect ke halaman login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
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
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed md:static top-0 left-0 h-screen md:h-auto z-50 
                       bg-gradient-to-b from-blue-600 to-indigo-700 
                       text-white border-r border-blue-700/50 p-5 w-64
                       shadow-xl shadow-blue-900/30 flex flex-col justify-between"
          >
            {/* Top: Logo & Nav */}
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <a href="/admin/dashboard/" className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md"
                    whileHover={{ rotate: 8, scale: 1.05 }}
                  >
                    A+
                  </motion.div>
                  <span className="font-semibold text-sm md:block hidden tracking-wide">
                    Asyik Math
                  </span>
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md hover:bg-blue-500/30 text-blue-100 md:hidden"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="h-px w-full bg-white/20 mb-4"></div>

              {/* Navigation */}
              <nav className="flex flex-col gap-1">
                {navItems.map(({ icon: Icon, text, path }) => (
                  <motion.a
                    key={path}
                    href={path}
                    className={`${linkBase} ${hover} ${
                      isActive(path)
                        ? "bg-blue-500/60 text-white shadow-md"
                        : "text-blue-100"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{text}</span>
                  </motion.a>
                ))}
              </nav>
            </div>

            {/* Bottom: Logout */}
            <motion.div
              onClick={handleLogout}
              className="mt-6 flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 
                        hover:bg-red-500/20 hover:text-red-100 cursor-pointer 
                        transition-all duration-300"
              whileHover={{ x: 4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
