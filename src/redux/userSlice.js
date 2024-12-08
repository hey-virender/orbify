import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
     
      state.user = action.payload;
      state.isAuthenticated = true;
       // Set authenticated to true when user is set
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false; // Set authenticated to false when user is cleared
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
