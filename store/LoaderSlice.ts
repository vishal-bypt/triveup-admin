import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
    name: "loader",
    initialState: { value: false },
    reducers: {
      startLoading: (state) => { state.value = true; },
      stopLoading: (state) => { state.value = false; }
    }
  });
  
  export const { startLoading, stopLoading } = loaderSlice.actions;
  export const LoaderReducer = loaderSlice.reducer;