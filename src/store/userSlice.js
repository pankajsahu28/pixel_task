import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async ({ limit, skip, sortBy, sortOrder, gender, country }) => {
  const response = await axios.get(`https://dummyjson.com/users`, {
    params: { limit, skip }
  });
  return response.data;
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
    total: 0,
    skip: 0,
    sortBy: 'id',
    sortOrder: 'asc',
    gender: '',
    country: '',
  },
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setGender: (state, action) => {
      state.gender = action.payload;
    },
    setCountry: (state, action) => {
      state.country = action.payload;
    },
    reset: (state) => {
      state.list = [];
      state.skip = 0;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = state.list.concat(action.payload.users);
        state.total = action.payload.total;
        state.skip = state.skip + action.payload.limit;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSortBy, setSortOrder, setGender, setCountry, reset } = userSlice.actions;

export default userSlice.reducer;