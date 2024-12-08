import { createSlice } from "@reduxjs/toolkit";

const contentSlice = createSlice({
  name: "content",
  initialState: {
    posts: [],
    stories: [],
    myStories:[],
    currentStories:[]

  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setStories: (state, action) => {
      state.stories = action.payload;
    },
    setMyStories: (state, action) => {
      state.myStories = action.payload;
    },
    setCurrentStories: (state, action) => {
      state.currentStories = action.payload;
    },
  },
});

export const { setPosts, setStories,setMyStories,setCurrentStories } = contentSlice.actions;
export default contentSlice.reducer;
