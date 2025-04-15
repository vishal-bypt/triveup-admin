import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null, // User object will be stored here
};

const TokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload; // Update user object
    },
    clearToken: (state) => {
      state.token = null; // Clear user on logout
    },
  },
});

// Export actions
export const { setToken, clearToken } = TokenSlice.actions;

// Export reducer
export const TokenReducer = TokenSlice.reducer;
