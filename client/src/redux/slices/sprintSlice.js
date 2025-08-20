import { createSlice } from "@reduxjs/toolkit";
import { createSprint, getSprintsByCourse } from "../actions/sprintActions";

const handlePending = (state) => {
	state.loading = true;
	state.error = null;
};

const handleRejected = (state, action) => {
	state.loading = false;
	state.error = action.payload;
};

const sprintSlice = createSlice({
	name: "sprint",
	initialState: {
		sprints: [],
		loading: false,
		error: null,
	},
	reducers: {
		resetSprintState: (state) => {
			state.courses = [];
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// CREATE SPRINT
			.addCase(createSprint.pending, handlePending)
			.addCase(createSprint.fulfilled, (state, action) => {
				state.loading = false;
				state.sprints.push(action.payload);
			})
			.addCase(createSprint.rejected, handleRejected)

			// LIST SPRINT BY COURSE ID
			.addCase(getSprintsByCourse.pending, handlePending)
			.addCase(getSprintsByCourse.fulfilled, (state, action) => {
				state.loading = false;
				state.sprints = action.payload;
			})
			.addCase(getSprintsByCourse.rejected, handleRejected);
		}
});

export const { resetSprintState } = sprintSlice.actions;
export default sprintSlice.reducer;