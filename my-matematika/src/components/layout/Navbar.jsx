import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { getStoredUser } from "../../lib/authClient.js";

// Judul halaman yang ramah, bukan kapitalisasi path mentah
const PAGE_TITLES = {
  dashboard: "Dashboard",
  materi: "Materi",
  quiz_materi: "Quiz Materi",
  quiz_global: "Quiz Global",
  quiz_event: "Quiz Event",
  pesan: "Masukan",
  settings: "Pengaturan",
};

export default function Navbar() {
  const [userEmail, setUserEmail] = useState("");
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/").filter(Boolean);
      const seg = parts[1] ?? "dashboard";
      setPageTitle(PAGE_TITLES[seg] ?? seg);
    }
    const u = getStoredUser();
    if (u?.email) setUserEmail(u.email);
  }, []);

  const handleToggle = () => {
    window.dispatchEvent(new CustomEvent("toggle-sidebar"));
  };

  const initial = (userEmail || "A").charAt(0).toUpperCase();

  return (
    <header className="w-full border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
            aria-label="Buka menu"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-base font-bold text-slate-900">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden sm:block text-sm font-medium text-slate-600">
            {userEmail}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
            {initial}
          </span>
        </div>
      </div>
    </header>
  );
}
