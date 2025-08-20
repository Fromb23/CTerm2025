import { createAsyncThunk } from "@reduxjs/toolkit";
import checkerApi from "../../api/checkeApi";

export const createSprint = createAsyncThunk(
  'sprint/createSprint',
  async ({ courseId, sprintData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(sprintData).forEach((key) => {
        formData.append(key, sprintData[key]);
      });

      console.log("Creating sprint with data:", sprintData, "for course:", courseId);

      const response = await checkerApi.post(
        `/courses/${courseId}/sprints/create/`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Create sprint failed');
    }
  }
);

export const getSprintsByCourse = createAsyncThunk(
  'sprint/getSprintsByCourse',
  async (courseId, { rejectWithValue }) => {
	try {
	  const response = await checkerApi.get(`/courses/${courseId}/sprints/`);
	  return response.data.sprints || [];
	} catch (err) {
	  return rejectWithValue(err.response?.data?.error || 'Failed to fetch sprints');
	}
  }
);