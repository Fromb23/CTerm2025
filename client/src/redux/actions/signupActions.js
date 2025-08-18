// signupAction.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import checkerApi from '../../api/checkeApi';

// CREATE (signup)
export const signupUser = createAsyncThunk(
  'signup/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        formData.append(key, userData[key]);
      });
      const response = await checkerApi.post('/users/students/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data; // { status: "success", user_id: ... }
    } catch (err) {
      console.error("Signup error:", err);
      return rejectWithValue(err.response?.data?.error || 'Signup failed');
    }
  }
);

// (Optional) READ, UPDATE, DELETE could be added later if backend supports them
// Example:
// export const fetchUser = createAsyncThunk(...);
// export const updateUser = createAsyncThunk(...);
// export const deleteUser = createAsyncThunk(...);
