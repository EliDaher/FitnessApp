// apis.api.ts
import API from "../utils/api"

// جلب بيانات المشترك
export const getAllExercises = () =>
  API.post("/getAllExercises");

// جلب التمرين حسب اسمه
export const getExerciseByName = (exerciseName: string) =>
API.get(`/getExerciseByName?name=${encodeURIComponent(exerciseName)}`);
