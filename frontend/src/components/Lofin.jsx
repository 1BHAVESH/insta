import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "./../../redux/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const LoginHandler = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/users/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },

          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setAuthUser(res.data.findUser))
        navigate("/")
        toast.success(res.data.message, {
          position: "top-center", // position: top, top-left, top-right can also be used.
        });

        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message, {
        position: "top-center", // position: top, top-left, top-right can also be used.
      });

      setInput({
        email: "",
        password: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <form
        onSubmit={LoginHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">Logo</h1>
          <p className="text-sm text-center my-1">
            Sign up to see photos and videos from your friends.
          </p>
        </div>
        <div>
          <Label>email</Label>
          <Input
            type="email"
            name="email"
            onChange={changeHandler}
            value={input.email}
            className="focus-visible:ring-2 my-2 border-black"
          />
        </div>
        <div>
          <Label>password</Label>
          <Input
            type="password"
            name="password"
            onChange={changeHandler}
            value={input.password}
            className="focus-visible:ring-2 border-black my-2"
          />
        </div>
        {
          loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <Button type="submit">Login</Button>
          )
        }
        
        <span className="text-center">
          Do Not Have Any Account Please Signup ?{" "}
          <Link to="/signup" className="text-blue-500">
            signup
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Login;
