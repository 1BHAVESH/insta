import {createSlice} from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: "Post",
    initialState:{
        posts: [],
        
    },
    reducers:{
        setPost: (state, action) => {
            state.posts = action.payload
        },

        
    }
})

export const {setPost} = postSlice.actions;
export default postSlice.reducer