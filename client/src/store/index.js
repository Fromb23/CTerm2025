import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../services/baseApi";

import authReducer from "./authSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		[baseApi.reducerPath]: baseApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(baseApi.middleware),
});

export default store;
