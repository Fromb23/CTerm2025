import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  refresh: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { access, refresh } = action.payload.tokens;
      const { user } = action.payload;

      state.token = access;
      state.refresh = refresh;
      state.user = user;

      // Optional: persist in localStorage
      localStorage.setItem("token", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.refresh = null;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
    },
    loadAuthFromStorage: (state) => {
      const token = localStorage.getItem("token");
      const refresh = localStorage.getItem("refresh");
      const user = localStorage.getItem("user");

      state.token = token || null;
      state.refresh = refresh || null;
      state.user = user ? JSON.parse(user) : null;
    },
  },
});

export const { setAuth, logout, loadAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;