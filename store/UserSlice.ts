import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // User object will be stored here
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Update user object
    },
    clearUser: (state) => {
      state.user = null; // Clear user on logout
    },
  },
});

// Export actions
export const { setUser, clearUser } = UserSlice.actions;

// Export reducer
export const UserReducer = UserSlice.reducer;
