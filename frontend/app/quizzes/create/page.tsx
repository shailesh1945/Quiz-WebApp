"use client";

import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import QuizForm from "@/components/QuizForm";

// wrap it with protected route in case someone tries to access it directly

export default function CreateQuizPage(){

 return(
 <ProtectedRoute allow={["TEACHER"]}>
   <DashboardLayout>
     <QuizForm/>
   </DashboardLayout>
 </ProtectedRoute>
 );
}