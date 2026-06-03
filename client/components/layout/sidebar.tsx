"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  CheckSquare,
  Bot,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Leads",
    href: "/leads",
    icon: Users,
  },
  {
    title: "Pipeline",
    href: "/pipeline",
    icon: KanbanSquare,
  },
  {
    title: "AI Assistant",
    href: "/assistant",
    icon: Bot,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-72 bg-[#111827] text-white border-r border-gray-800 p-6 flex flex-col">
      {/* <h1 className="text-3xl font-bold tracking-tight mb-10">LeadFlow.AI</h1> */}
      <Link
  href="/dashboard"
  className="text-3xl font-bold tracking-tight mb-10 block cursor-pointer"
>
  LeadFlow.AI
</Link>

      <nav className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                pathname === item.href
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={22} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
