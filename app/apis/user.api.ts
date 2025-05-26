// apis.api.ts
import API from "../utils/api"

// جلب بيانات المشترك
export const getUserData = (username: string) =>
  API.post("/getUserData", { username });


export const updatePersonalDetails = (username: string, address: string, job: string, date: Date, bloodType: string, healthConditions: string) =>
  API.post("/updatePersonalDetails", { username, address, job, date, bloodType, healthConditions });

export const getUserWorkout = (username: string) =>
  API.post("/getUserWorkout", { username });

export const getNutritionProgramById = (id: string) =>
  API.get(`/getNutritionProgramById/${id}`);

export const skipOrStartNewWorkout = (username: string) =>
  API.post("/skipOrStartNewWorkout", { username });

