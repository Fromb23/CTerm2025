import { createSlice } from "@reduxjs/toolkit";
import { createCourse, listCourses } from "../actions/courseActions";

const handlePending = (state) => {
	state.loading = true;
	state.error = null;
};

const handleRejected = (state, action) => {
	state.loading = false;
	state.error = action.payload;
};

const courseSlice = createSlice({
	name: "course",
	initialState: {
		courses: [],
		loading: false,
		error: null,
	},
	reducers: {
		resetCourseState: (state) => {
			state.courses = [];
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// CREATE COURSE
			.addCase(createCourse.pending, handlePending)
			.addCase(createCourse.fulfilled, (state, action) => {
				state.loading = false;
				state.courses.push(action.payload);
			})
			.addCase(createCourse.rejected, handleRejected)

			// LIST COURSES
			.addCase(listCourses.pending, handlePending)
			.addCase(listCourses.fulfilled, (state, action) => {
				state.loading = false;
				console.log("Courses fetched in slice:", action.payload);
				// action.payload can be either an array or { courses: [...] }
				state.courses = Array.isArray(action.payload)
					? action.payload
					: action.payload.courses;
			})
			.addCase(listCourses.rejected, handleRejected);
	},
});

export const { resetCourseState } = courseSlice.actions;
export default courseSlice.reducer;