import Link from "next/link";

export default function Home() {
 return (
  <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">

   <h1 className="text-6xl font-bold mb-6">
    Quizzy
   </h1>

   <p className="text-slate-400 mb-8">
    Create quizzes. Run live events.
   </p>

   <div className="flex gap-4">
    <Link href="/login"
     className="px-6 py-3 bg-blue-600 rounded-xl">
      Login
    </Link>

    <Link href="/register"
     className="px-6 py-3 bg-slate-700 rounded-xl">
      Register
    </Link>
   </div>

  </main>
 );
}