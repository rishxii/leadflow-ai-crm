import Sidebar from "./sidebar";

import Navbar from "./navbar";

import { useAuth } from "@/context/auth-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-8 overflow-y-auto animate-in fade-in duration-300">
          <div className="max-w-7xl mx-auto w-full">
          {children}
          </div>
        </main>
      </div>
    </div>
  );
}
