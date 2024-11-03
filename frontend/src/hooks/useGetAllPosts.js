// const { default: axios } = require("axios")
// const { useEffect } = require("react")

import axios from "axios";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPost } from "./../../redux/postSlice.js";

export const useGetAllPosts = () => {

    const dispatch = useDispatch();
    useEffect(() => {

        const fetchPosts = async() => {
            try {
                const res = await axios.get("http://localhost:8080/api/v1/post/feed_post",{withCredentials: true})

                if(res.data.success){

                    console.log(res.data.post)

                    dispatch(setPost(res.data.post))
                }


            } catch (error) {
                console.log(error)
            }
        } 

        fetchPosts()

    },[])
}