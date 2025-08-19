import { createAsyncThunk } from "@reduxjs/toolkit";
import checkerApi from "../../api/checkeApi";

export const loginUser = createAsyncThunk(
	"login/loginUser",
	async (userData, { rejectWithValue }) => {
		try {
			const response = await checkerApi.post("/auth/login/", userData);
			console.log("Response data", response.data);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);
