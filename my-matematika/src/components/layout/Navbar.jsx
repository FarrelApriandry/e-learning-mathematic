import { UserCircle2, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../lib/firebaseConfig";

export default function Navbar() {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const u = getCurrentUser ? getCurrentUser() : null;
    if (u) setUserEmail(u.email);
  }, []);

  const handleToggle = () => {
    // broadcast event for sidebar toggle
    window.dispatchEvent(new CustomEvent("toggle-sidebar"));
  };

  return (
    <header className="w-full border-b border-gray-100 bg-white/70 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggle}
            className="md:hidden p-2 rounded-md hover:bg-slate-100 transition"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6 text-slate-700" />
          </button>
          <span className="text-sm font-semibold text-slate-700">Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-slate-800">
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
