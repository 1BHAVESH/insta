import React, { useState } from "react";
import { Label } from "./ui/label";
import {Input} from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

    const [input, setInput] = useState({
        username:"",
        email:"",
        password:"",
    })

    const changeHandler = (e) => {

        setInput({...input, [e.target.name]: e.target.value})

       
    }

    const signupHandler = async(e)=>{
        e.preventDefault()

        try {

            const res = await axios.post("http://localhost:8080/api/v1/users/register", input, {
                headers:{
                    'Content-Type': "application/json",
                },

                withCredentials: true
            })

            console.log(res)
            
            if(res.data.success){

              navigate("/login")

                toast.success(res.data.message)

                setInput({
                    username:"",
                    email:"",
                    password:"",
                })


            }

            setInput({
                username:"",
                email:"",
                password:"",
            })
        } catch (error) {
            console.log(error.response.data.message)
            toast.error(error.response.data.message)

            setInput({
                username:"",
                email:"",
                password:"",
            })
        }
    }

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8">
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">Logo</h1>
          <p className="text-sm text-center my-1">Sign up to see photos and videos from your friends.</p>
        </div>
        <div>
        <Label>username</Label>
        <Input type="text" name="username" onChange={changeHandler} className="focus-visible:ring-2 my-2 border-black" value={input.username} />
        </div>
        <div>
          <Label>email</Label>
          <Input type="email" name="email" onChange={changeHandler} value={input.email} className="focus-visible:ring-2 my-2 border-black" />
        </div>
        <div>
          <Label>password</Label>
          <Input type="password" name="password" onChange={changeHandler} value={input.password} className="focus-visible:ring-2 border-black my-2" />
        </div>
        <Button type="submit">Signup</Button>
        <span className="text-center">Already Have an Account ? <Link to="/login" className="text-blue-500">Login</Link></span>
      </form>
    </div>
  );
}

export default Signup;
