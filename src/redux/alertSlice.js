// alertSlice.js
import { createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
  name: "alert",
  initialState: {
    error: null,
    success: null,
    warning: null,
  },
  reducers: {
    showAlert: (state, action) => {
      const { type, message } = action.payload;
      if (type === "error") {
        state.error = message;
      } else if (type === "success") {
        state.success = message;
      } else if (type === "warning") {
        state.warning = message;
      }
    },
    hideAlert: (state) => {
      state.error = null;
      state.success = null;
      state.warning = null;
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;
