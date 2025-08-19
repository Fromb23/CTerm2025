import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from '../actions/loginActions';

const initialUser = JSON.parse(localStorage.getItem("user")) || null;

const loginSlice = createSlice({
	name: 'login',
	initialState: {
		user: initialUser,
		loading: false,
		isAuthenticated: !!initialUser,
		error: null,
	},
	reducers: {
		loginState: (state) => {
			state.user = null;
			state.loading = false;
			state.error = null;
			state.isAuthenticated = false;
		},
		logoutState: (state) => {
			state.user = null;
			state.loading = false;
			state.error = null;
			state.isAuthenticated = false;
			localStorage.removeItem("user");
			window.location.href = '/login';
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.isAuthenticated = false;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
				state.isAuthenticated = true;
				localStorage.setItem("user", JSON.stringify(action.payload));
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
				state.isAuthenticated = false;
			});
	}
});

export const { loginState, logoutState } = loginSlice.actions;
export default loginSlice.reducer;
