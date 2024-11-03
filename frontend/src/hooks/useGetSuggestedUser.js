// const { default: axios } = require("axios")
// const { useEffect } = require("react")

import axios from "axios";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPost } from "./../../redux/postSlice.js";
import { setSuggestedUsers } from "../../redux/authSlice.js";

export const useGetSuggestedUser = () => {

    const dispatch = useDispatch();
    useEffect(() => {

        const suggestedUser = async() => {
            try {
                const res = await axios.get("http://localhost:8080/api/v1/users/suggested",{withCredentials: true})

                if(res.data.success){

                    // console.log(res.data.post)

                    dispatch(setSuggestedUsers(res.data.users))
                }


            } catch (error) {
                console.log(error)
            }
        } 

        suggestedUser()

    },[])
}