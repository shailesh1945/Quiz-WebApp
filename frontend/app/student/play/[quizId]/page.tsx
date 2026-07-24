"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import QuizPlayer from "@/components/QuizPlayer";

export default function PlayQuizPage({
 params
}: any) {

 return (
   <ProtectedRoute allow={["STUDENT"]}>
     <QuizPlayer quizId={params.quizId} />
   </ProtectedRoute>
 );
}