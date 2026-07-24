"use client";

import StudentSidebar from './StudentsSidebar';
import StudentNavbar from './StudentsNavbar';


export default function StudentLayout({
  children
}: any) {

  return (
    <div className="min-h-screen bg-slate-950">

      <StudentSidebar />

      <div className="ml-72">

        <StudentNavbar />

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}