"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { User, Mail, Shield } from "lucide-react";

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] =
    useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get(
        "/user/me"
      ); // change endpoint if needed

      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">
        Settings
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-slate-900 p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold uppercase">
              {user.username?.charAt(0)}
            </div>

            <div>
              <h2 className="text-2xl font-semibold">
                {user.username}
              </h2>

              <p className="text-slate-400">
                {user.role}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <User size={18} />
              {user.username}
            </div>

            <div className="flex gap-3">
              <Mail size={18} />
              {user.email}
            </div>

            <div className="flex gap-3">
              <Shield size={18} />
              {user.role}
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-6">
            Theme
          </h2>

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="bg-blue-600 px-5 py-3 rounded-xl"
          >
            {darkMode
              ? "Dark Mode"
              : "Light Mode"}
          </button>
        </div>
      </div>
    </div>
  );
}