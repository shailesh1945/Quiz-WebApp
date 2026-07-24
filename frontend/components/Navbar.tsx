"use client";

import { Bell, Search, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const [user, setUser] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    api.get("/user/me")
      .then(res => setUser(res.data));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="h-20 bg-slate-950 border-b border-slate-800 px-8 flex items-center justify-between">

      <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-xl w-96">

        <Search size={18} className="text-slate-400" />

        <input
          placeholder="Search quizzes..."
          className="bg-transparent outline-none text-white w-full"
        />

      </div>

      <div className="flex items-center gap-5">

        <button className="relative">
          <Bell className="text-slate-300" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {user && (
          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl">

            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {user.fullName?.charAt(0)}
            </div>

            <div>
              <p className="text-white text-sm font-semibold">
                {user.fullName}
              </p>

              <p className="text-slate-400 text-xs">
                {user.role}
              </p>
            </div>

            <button
              onClick={logout}
              className="ml-2 text-red-400 hover:text-red-300"
            >
              <LogOut size={18} />
            </button>

          </div>
        )}

      </div>

    </header>
  );
}