import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
name:"ui",
initialState:{
    activeSection:"home",
   
    showChat:false,

},
reducers:{
    toggleActiveSection:(state,action)=>{
        state.activeSection=action.payload;
    },
   
    toggleShowChat:(state, action)=>{
        state.showChat=action.payload;
    }
}
})

export const {toggleActiveSection,toggleShowChat}=uiSlice.actions;

export default uiSlice.reducer;