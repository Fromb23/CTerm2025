import { configureStore } from "@reduxjs/toolkit"
import loggerMiddleware from "../middleware/logger"
import rootReducer from "../slices"

export default function setupStore(preloadedState) {
	return configureStore({
		reducer: rootReducer,
		preloadedState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(loggerMiddleware),
		devTools: process.env.NODE_ENV !== "production",
	})
}