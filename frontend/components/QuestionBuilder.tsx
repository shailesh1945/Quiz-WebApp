"use client";

import { useState } from "react";
import api from "@/services/api";

export default function QuestionBuilder({
 quizId,
 publishQuiz,
 onAdded
}: any) {

 const empty = {
   questionText:"",
   optionA:"",
   optionB:"",
   optionC:"",
   optionD:"",
   correctAnswer:"A",
   points:5
 };

 const [q,setQ]=useState(empty);

 const [count,setCount]=useState(0);

 const [loading,setLoading]=
   useState(false);

 const addQuestion =
 async()=>{

   try{

     setLoading(true);

     await api.post(
       `/teacher/quizzes/${quizId}/questions`,
       q
     );

     setCount(count+1);

     setQ(empty);

     if(onAdded) onAdded();

   } finally {
     setLoading(false);
   }
 };

 return(
 <div className="bg-slate-900 p-8 rounded-2xl mt-8">

  <h2 className="text-2xl text-white mb-6">
   Add Questions ({count})
  </h2>

  <textarea
   placeholder="Question"
   value={q.questionText}
   onChange={(e)=>
    setQ({...q,
      questionText:e.target.value
    })
   }
   className="w-full p-4 bg-slate-800 rounded-xl text-white mb-4"
  />

  <div className="grid grid-cols-2 gap-4">

   {["A","B","C","D"].map((opt)=>(

    <input
     key={opt}
     placeholder={`Option ${opt}`}
     value={q[
      `option${opt}` as keyof typeof q
     ] as any}
     onChange={(e)=>
      setQ({
       ...q,
       [`option${opt}`]:
       e.target.value
      })
     }
     className="p-4 bg-slate-800 rounded-xl text-white"
    />

   ))}

  </div>

  <div className="grid grid-cols-2 gap-4 mt-4">

   <select
    value={q.correctAnswer}
    onChange={(e)=>
     setQ({
      ...q,
      correctAnswer:e.target.value
     })
    }
    className="p-4 bg-slate-800 rounded-xl text-white"
   >
    <option>A</option>
    <option>B</option>
    <option>C</option>
    <option>D</option>
   </select>

   <input
    type="number"
    value={q.points}
    onChange={(e)=>
     setQ({
      ...q,
      points:+e.target.value
     })
    }
    className="p-4 bg-slate-800 rounded-xl text-white"
   />

  </div>

  <div className="flex gap-4 mt-6">

   <button
    onClick={addQuestion}
    disabled={loading}
    className="bg-blue-600 px-6 py-3 rounded-xl text-white"
   >
    {loading ?
     "Adding..." :
     "Add Question"}
   </button>

   <button
    onClick={publishQuiz}
    className="bg-green-600 px-6 py-3 rounded-xl text-white"
   >
    Publish Quiz
   </button>

  </div>

 </div>
 );
}