import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("blog_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerAdmin = (data) => API.post("/admin", data);
export const loginAdmin = (data) => API.post("/admin/login", data);
export const getProfile = () => API.get("/admin/profile");

export const getAllBlogs = () => API.get("/blogs");
export const getBlogById = (id) => API.get(`/blogs/${id}`);
export const createBlog = (data) => API.post("/blogs", data);
export const updateBlog = (id, data) => API.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);

export const likeBlog = (id, visitorId) => API.post(`/blogs/${id}/like`, { visitorId });
export const addComment = (id, data) => API.post(`/blogs/${id}/comment`, data);
export const shareBlog = (id) => API.post(`/blogs/${id}/share`);

export default API;
