"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlayCircle,
  Trophy,
  Calendar,
  BookOpen
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    href: "/student",
    icon: LayoutDashboard
  },
  {
    name: "Join Quiz",
    href: "/student/join",
    icon: PlayCircle
  },
  
  // {
  //   name: "Results",
  //   href: "/student/results",
  //   icon: BookOpen
  // },

   {
    name: "Explore Quizzes",
    href: "/student/quizzes",
    icon: BookOpen
  },
  {
    name: "Leaderboard",
    href: "/student/leaderboard",
    icon: Trophy
  },
  {
    name: "Events",
    href: "/student/events",
    icon: Calendar
  }
];

export default function StudentSidebar() {

  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen bg-slate-900 border-r border-slate-800 p-6 fixed left-0 top-0">

      <h1 className="text-white text-3xl font-bold mb-10">
        Quizzy
      </h1>

      <nav className="space-y-3">

        {menus.map((item, i) => {

          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={i}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                active
                  ? "bg-green-600 text-white"
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