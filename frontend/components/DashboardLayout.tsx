import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({
 children
}:{
 children:React.ReactNode
}){

 return(
 <div className="bg-slate-950 min-h-screen">

   <Sidebar/>

   <div className="ml-72">

     <Navbar/>

     <main className="p-8">
      {children}
     </main>

   </div>

 </div>
 );
}