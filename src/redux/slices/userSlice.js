import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//const API_URL = "http://localhost:5003/users";

const REDUX_API_URL = process.env.REACT_APP_REDUX_API_URL;
console.log("--",process.env.REACT_APP_REDUX_API_URL);

// Fetch Users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(REDUX_API_URL);
   // await new Promise((resolve) => setTimeout(resolve, 2000));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Add User
export const addUser = createAsyncThunk("users/addUser", async (user, { rejectWithValue }) => {
  try {
    const response = await axios.post(REDUX_API_URL, user);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Update User
export const updateUser = createAsyncThunk("users/updateUser", async (user, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${REDUX_API_URL}/${user.id}`, user);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Delete User
export const deleteUser = createAsyncThunk("users/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${REDUX_API_URL}/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add User
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })

      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
