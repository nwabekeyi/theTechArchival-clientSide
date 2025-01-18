// src/store/webSocketSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  usersData: {},
  error: null,
  connected: false,
  allCourses: []
};

const adminDataSlice = createSlice({
  name: 'adminData',
  initialState,
  reducers: {
    setUsersData: (state, action) => {
      state.usersData = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setConnectionStatus: (state, action) => {
      state.connected = action.payload;
    },
    setAllCourses: (state, action) => {
      state.courses = action.payload;
    },

  },
});

export const { setUsersData, setAllCourses, setError, setConnectionStatus } = adminDataSlice.actions;

export const selectadminDataState = (state) => state.adminData;

export default adminDataSlice.reducer;
