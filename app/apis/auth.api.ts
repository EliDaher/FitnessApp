// apis.api.ts
import API from "../utils/api";

// ✅ Signup مع كل الحقول المطلوبة
export const signup = (
  fullname: string,
  username: string,
  email: string,
  password: string,
  confirmPassword: string
) =>
  API.post("/SignUp", {
    fullname,
    username,
    email,
    password,
    confirmPassword,
});

// ✅ Login فقط بالبريد وكلمة المرور
export const login = (username: string, password: string) =>
  API.post("/login", { username, password });


export const addWeight = (weight: number, username: string) =>
  API.post("/addWeight", { weight, username });


export const addAge = (age: number, username: string) =>
  API.post("/addAge", { age, username });


export const addHeight = (height: number, username: string) =>
  API.post("/addHeight", { height, username });


export const addGender = (gender: string, username: string) =>
  API.post("/addGender", { gender, username });
