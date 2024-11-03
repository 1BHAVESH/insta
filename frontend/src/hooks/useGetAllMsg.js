// const { default: axios } = require("axios")
// const { useEffect } = require("react")

import axios from "axios";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "./../../redux/postSlice.js";
import { setSuggestedUsers } from "../../redux/authSlice.js";
import { setMsg } from "../../redux/chatSlice.js";

export const useGetAllMsg = () => {


    console.log("bffjbnfjndjfnfjn")
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store => store.auth)
    useEffect(() => {

        const fetchAllMsg = async() => {
            try {
                const res = await axios.get(`http://localhost:8080/api/v1/message/recive/${selectedUser?._id}`,{withCredentials: true})

                console.log(res)
                if(res.data.success){

                     console.log(res.data)

                    dispatch(setMsg(res.data.messages))
                }


            } catch (error) {
                console.log(error)
            }
        } 

        fetchAllMsg()

    },[selectedUser])
}