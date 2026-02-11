import axios from "axios";

// const API_BASE_URL = "http://localhost:8080/api";

// const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const API_BASE_URL = window._env_?.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

// ✅ Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Attach JWT token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------- AUTH ----------------
export const loginUser = (data) =>
  api.post("/users/login", data);

export const signupUser = (data) =>
  api.post("/users/signup", data);

export const logoutUser = () => 
  api.post("/users/logout"); // Auth required

// ---------------- COURSES ----------------
export const getCourses = () =>
  api.get("/courses");  // Auth required

export const getPublicCourses = () => 
  api.get("/courses/public"); // No auth

export const createCourse = (data) =>
  api.post("/courses", data);

// ---------------- CERTIFICATIONS ----------------
export const getCertifications = () =>
  api.get("/certifications");

export const createCertification = (data) =>
  api.post("/certifications", data);

// ---------------- PROFILE ----------------
export const getProfile = () => 
  api.get("/profile"); // no userId needed

// ---------------- RECOMMENDATIONS ----------------
export const getRecommendations = (skills) =>
  api.post("/recommend", { skills }); // Only for logged-in users

// ---------------- AI Recommendations ----------------
export const getAIRecommendations = (data) =>
  api.post("/recommend", data); // POST request with { skills: [...] }

export default api;