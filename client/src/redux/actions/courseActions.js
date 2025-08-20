import { createAsyncThunk } from '@reduxjs/toolkit';
import checkerApi from '../../api/checkeApi';

export const createCourse = createAsyncThunk(
	'course/createCourse',
	async (courseData, { rejectWithValue }) => {
		try {
			const response = await checkerApi.post(
				'/courses/create/',
				courseData,
				{ headers: { 'Content-Type': 'application/json' } }
			);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

export const listCourses = createAsyncThunk(
	'course/listCourses',
	async (_, { rejectWithValue }) => {
		try {
			const response = await checkerApi.get('/courses/get/');
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);