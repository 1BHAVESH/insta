import {createSlice} from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState:{
        onlineUser: [],
        msg:[]
        
    },
    reducers:{
        setOnlineUser: (state, action) => {
            state.onlineUser = action.payload
        },
        setMsg: (state, action) => {
            state.msg = action.payload
        }

        
    }
})

export const {setOnlineUser, setMsg} = chatSlice.actions;
export default chatSlice.reducer