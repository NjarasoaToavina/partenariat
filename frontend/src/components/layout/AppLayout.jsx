import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full flex bg-slate-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
 
      <div className="flex-1 min-w-0 flex flex-col h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />
 
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}