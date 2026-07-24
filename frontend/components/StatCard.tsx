type Props = {
 title:string;
 value:string;
};

export default function StatCard({
 title,
 value
}:Props){

 return(
 <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">

   <p className="text-slate-400 text-sm">
    {title}
   </p>

   <h2 className="text-white text-4xl font-bold mt-2">
    {value}
   </h2>

 </div>
 );
}