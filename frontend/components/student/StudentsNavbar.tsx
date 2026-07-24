"use client";

import { Bell, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function StudentNavbar() {

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

      <h2 className="text-white text-xl font-semibold">
        Student Portal
      </h2>

      <div className="flex items-center gap-4">

        <Bell className="text-slate-300" />

        {user && (
          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl">

            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
              {user.fullName?.charAt(0)}
            </div>

            <div>
              <p className="text-white text-sm">
                {user.fullName}
              </p>

              <p className="text-slate-400 text-xs">
                STUDENT
              </p>
            </div>

            <button
              onClick={logout}
              className="text-red-400"
            >
              <LogOut size={18} />
            </button>

          </div>
        )}

      </div>

    </header>
  );
}