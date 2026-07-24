"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BookOpen,
  Users,
  Trophy,
  Calendar,
  Settings
} from "lucide-react";

const menus = [
  {
    icon: LayoutDashboard,
    name: "Dashboard",
    href: "/dashboard"
  },
  {
    icon: BookOpen,
    name: "Quizzes",
    href: "/quizzes"
  },
  {
    icon: Users,
    name: "Students",
    href: "/manage-students"
  },
  {
    icon: Trophy,
    name: "Leaderboard",
    href: "/leaderboard"
  },
  {
    icon: Calendar,
    name: "Events",
    href: "/events"
  },
  {
    icon: Settings,
    name: "Settings",
    href: "/settings"
  }
];

export default function Sidebar() {

  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen bg-slate-900 border-r border-slate-800 p-6 fixed left-0 top-0">

      <h1 className="text-white text-3xl font-bold mb-10">
        Quizzy
      </h1>

      <nav className="space-y-3">

        {menus.map((item, index) => {

          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
              ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >

              <Icon size={20} />

              {item.name}

            </Link>
          );
        })}

      </nav>

    </aside>
  );
}