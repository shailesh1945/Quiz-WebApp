"use client";

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      const me = await api.get("/user/me");

      const role = me.data.role;

      if (role === "TEACHER") {
        router.push("/dashboard");
      } else if (role === "STUDENT") {
        router.push("/student");
      } else if (role === "ADMIN") {
        router.push("/admin");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-2xl w-96">
        <h1 className="text-2xl text-white mb-6">Login</h1>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-slate-800 text-white"
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-slate-800 text-white"
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 py-3 rounded-xl text-white"
        >
          Login
        </button>

        <p className="text-slate-400 text-sm mt-6 text-center">
          Don't have an account?{" "}
         <Link href="/register">
            <span className="text-blue-500">Register</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
