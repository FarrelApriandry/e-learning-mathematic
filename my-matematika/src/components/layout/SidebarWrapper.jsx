import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function SidebarWrapper({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex w-full">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="pt-16 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}