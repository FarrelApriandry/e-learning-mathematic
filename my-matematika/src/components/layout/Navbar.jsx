import { UserCircle2, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../lib/firebaseConfig";
// import { useLocation } from "react-router-dom";

export default function Navbar() {
  const [userEmail, setUserEmail] = useState(null);

  // // const pageName = window.location.pathname.split("/")[1] || "home";
  // const location = useLocation();
  // const [currentPage, setCurrentPage] = useState("");

  // useEffect(() => {
  //   setCurrentPage(location.pathname.split("/")[1] || "home");
  // }, [location.pathname]);

  // const pageName = window.location.pathname.split("/")[1] || "home";
  const pathParts =
  typeof window !== "undefined"
    ? window.location.pathname.split("/").filter(Boolean) // hapus elemen kosong
    : [];

  const parentPage = pathParts[0] ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1) : "Home";
  const currentPage = pathParts[1] ? pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1) : "HOME";

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
          <span className="text-sm font-semibold text-slate-700">{currentPage}</span>
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
