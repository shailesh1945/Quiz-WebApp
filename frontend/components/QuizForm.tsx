"use client";

import { useState } from "react";
import api from "@/services/api";
import QuestionBuilder from "./QuestionBuilder";

export default function QuizForm(){

 const [step,setStep]=useState(1);

 const [quiz,setQuiz]=useState({
   title:"",
   description:"",
   category:"",
   difficulty:"Easy",
   timeLimit:10,
   passingScore:50,
   randomQuestions:true,
   instantResults:true,
   status:"DRAFT"
 });

 const [quizId,setQuizId]=useState<number|null>(null);

 const createQuiz = async()=>{

   const res = await api.post(
     "/teacher/quizzes",
     quiz
   );

   setQuizId(res.data.id);
   setStep(2);
 };

 const publishQuiz = async()=>{

   await api.put(
    `/teacher/quizzes/${quizId}`,
    {
      ...quiz,
      status:"PUBLISHED"
    }
   );

   alert("Quiz Published");
 };

 return(
 <div>

  <h1 className="text-3xl text-white font-bold mb-8">
   Create Quiz
  </h1>

  {step===1 && (

   <div className="bg-slate-900 p-8 rounded-2xl space-y-4">

    <input
     placeholder="Quiz Title"
     className="w-full p-3 bg-slate-800 rounded-xl text-white"
     onChange={(e)=>
      setQuiz({...quiz,title:e.target.value})
     }
    />

    <textarea
     placeholder="Description"
     className="w-full p-3 bg-slate-800 rounded-xl text-white"
     onChange={(e)=>
      setQuiz({...quiz,description:e.target.value})
     }
    />

    <input
     placeholder="Category"
     className="w-full p-3 bg-slate-800 rounded-xl text-white"
     onChange={(e)=>
      setQuiz({...quiz,category:e.target.value})
     }
    />

    <div className="grid grid-cols-3 gap-4">

     <select
      className="p-3 bg-slate-800 rounded-xl text-white"
      onChange={(e)=>
       setQuiz({
        ...quiz,
        difficulty:e.target.value
       })
      }
     >
      <option>Easy</option>
      <option>Medium</option>
      <option>Hard</option>
     </select>

     <input
      type="number"
      placeholder="Time (min)"
      className="p-3 bg-slate-800 rounded-xl text-white"
      onChange={(e)=>
       setQuiz({
        ...quiz,
        timeLimit:+e.target.value
       })
      }
     />

     <input
      type="number"
      placeholder="Passing %"
      className="p-3 bg-slate-800 rounded-xl text-white"
      onChange={(e)=>
       setQuiz({
        ...quiz,
        passingScore:+e.target.value
       })
      }
     />

    </div>

    <button
     onClick={createQuiz}
     className="bg-blue-600 px-8 py-3 rounded-xl text-white">
      Continue
    </button>

   </div>
  )}

  {step===2 && quizId && (
   <QuestionBuilder
    quizId={quizId}
    publishQuiz={publishQuiz}
   />
  )}

 </div>
 );
}