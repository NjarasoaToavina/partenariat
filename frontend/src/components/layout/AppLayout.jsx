import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header />

        <main className="flex-1 px-6 md:px-8 py-6 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}