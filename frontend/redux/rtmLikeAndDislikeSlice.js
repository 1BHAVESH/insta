import {createSlice} from "@reduxjs/toolkit";
import { act } from "react";

const rtmSlice = createSlice({
    name:"realTimeNotification",
    initialState:{
        likeNotify:[],
        mssg:[],
    },
    reducers:{
        setLikeNotify:(state, action) => {
            if(action.payload.type === "like"){
                state.likeNotify.push(action.payload)
            }else if(action.payload.type === "dislike"){
                state.likeNotify = state.likeNotify.filter((item) => item.userId !== action.payload.userId)
            }else if(action.payload.type === ""){
                state.likeNotify = []
            }

        },

        setMssg:(state, action) => {
            state.mssg = action.payload
        }
    }
})

export const {setLikeNotify, setMssg} = rtmSlice.actions;
export default rtmSlice.reducer