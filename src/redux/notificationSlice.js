import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState:{
    notifications:[],
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setNewNotification: (state, action) => {
      state.notifications.push(action.payload); // Adds new notification to the state
    },
    clearNotifications: (state) => {
      state.notifications = []; // Clears all notifications
    },
    
  },
});

export const { setNotifications,setNewNotification,clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;