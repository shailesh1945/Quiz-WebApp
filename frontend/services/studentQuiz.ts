import api from "./api";

export const getPublicQuizzes = async () => {
  const res = await api.get("/student/quizzes");
  return res.data;
};