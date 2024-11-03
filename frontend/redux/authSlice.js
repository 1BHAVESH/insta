import {createSlice} from "@reduxjs/toolkit";
import { Bookmark } from "lucide-react";

const authSlice = createSlice({
    name: "Auth",
    initialState:{
        user: null,
        suggestedUsers: [],
        userProfile: null,
        selectedUser : null,
        bookmark:false
        
    },
    reducers:{
        setAuthUser: (state, action) => {
            state.user = action.payload
        },

        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload
        },

        setUserProfile: (state, action) => {
            state.userProfile = action.payload
        },
        setSelectedUser:(state, action) => {
            state.selectedUser = action.payload
        },
        setBookmark:(state, action) => {
            state.bookmark = action.payload;
        }

        
    }
})

export const {setAuthUser, setSuggestedUsers, setUserProfile, setSelectedUser, setBookmark} = authSlice.actions;
export default authSlice.reducer