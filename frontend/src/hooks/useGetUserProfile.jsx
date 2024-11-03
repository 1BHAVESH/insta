// const { default: axios } = require("axios")
// const { useEffect } = require("react")

import axios from "axios";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPost } from "./../../redux/postSlice.js";
import { setSuggestedUsers, setUserProfile } from "../../redux/authSlice.js";

export const useGetUserProfile = (userId) => {

    // console.log(userId)

    const dispatch = useDispatch();
    useEffect(() => {

        const getUserPro = async() => {
            try {
                const res = await axios.get(`http://localhost:8080/api/v1/users/${userId}/profile`,{withCredentials: true})

                if(res.data.success){

                    // console.log(res.data.user)

                    dispatch(setUserProfile(res.data.user))
                }


            } catch (error) {
                console.log(error)
            }
        } 

        getUserPro()

    },[userId])
}