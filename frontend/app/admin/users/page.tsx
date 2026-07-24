"use client";

import { useEffect,useState } from "react";
import api from "@/services/api";

export default function UsersPage(){

 const [users,setUsers]=useState([]);

 const load=()=>{
   api.get("/admin/users")
   .then(res=>setUsers(res.data));
 };

 useEffect(()=>{load();},[]);

 const toggle=async(id:number)=>{
   await api.put(`/admin/users/${id}/toggle`);
   load();
 };

 const remove=async(id:number)=>{
   await api.delete(`/admin/users/${id}`);
   load();
 };

 return(
 <div className="min-h-screen bg-slate-950 text-white p-8">

  <h1 className="text-3xl font-bold mb-8">
   Users
  </h1>

  <div className="space-y-3">

   {users.map((u:any)=>(
    <div
     key={u.id}
     className="bg-slate-900 p-5 rounded-xl flex justify-between">

      <div>
       <p>{u.fullName}</p>
       <p className="text-slate-400">
        {u.email}
       </p>
      </div>

      <div className="flex gap-3">

       <button
        onClick={()=>toggle(u.id)}
        className="bg-yellow-600 px-4 rounded">

        {u.active ? "Ban" : "Activate"}

       </button>

       <button
        onClick={()=>remove(u.id)}
        className="bg-red-600 px-4 rounded">

        Delete

       </button>

      </div>

    </div>
   ))}

  </div>

 </div>
 );
}