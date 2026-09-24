import { create } from "zustand";
import { loginAdmin, registerAdmin, getProfile } from "../api";

const useAuthStore = create((set) => ({
  admin: null,
  loading: true,

  checkAuth: async () => {
    const token = localStorage.getItem("blog_token");
    if (!token) {
      set({ loading: false });
      return;
    }
    try {
      const res = await getProfile();
      set({ admin: res.data.admin, loading: false });
    } catch {
      localStorage.removeItem("blog_token");
      set({ admin: null, loading: false });
    }
  },

  login: async (email, password) => {
    const res = await loginAdmin({ email, password });
    localStorage.setItem("blog_token", res.data.token);
    set({ admin: res.data.admin });
    return res.data;
  },

  register: async (username, email, password) => {
    const res = await registerAdmin({ username, email, password });
    localStorage.setItem("blog_token", res.data.token);
    set({ admin: res.data.admin });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("blog_token");
    set({ admin: null });
  },
}));

export default useAuthStore;
