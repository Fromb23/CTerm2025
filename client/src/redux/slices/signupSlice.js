// signupSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { signupUser } from "../actions/signupActions";

const signupSlice = createSlice({
	name: "signup",
	initialState: {
		user: null,
		loading: false,
		error: null,
	},
	reducers: {
		signupState: (state) => {
			state.user = null;
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(signupUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(signupUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(signupUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { signupState } = signupSlice.actions;
export default signupSlice.reducer;
