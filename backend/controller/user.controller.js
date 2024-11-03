import { User } from "../modals/user.modal.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Post } from "../modals/post.modal.js";

export const regisetr = async (req, res) => {
    try {

        const{username, email, password} = req.body;

        // console.log(req.body)

        if(!username || !email || !password){
            return res.status(401).json({
                mesaage:"something is missing please check felds",
                success:false,
            })
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(401).json({
                message:"This email id already registerd, Try with new email id",
                success:false,
            })
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        await User.create({
            username: username,
            email:email,
            password: hashedPassword,
        })

        return res.status(201).json({
            message: "Account Created Successfully",
            success: true,
        })
        
    } catch (error) {
        console.log(error)
    }
}

export  const login = async(req, res) => {
    try {
        const{email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "please provide email and password",
                success: false,
            })
        }

        let findUser = await User.findOne({email});

        if(!findUser){
            return res.status(400).json({
                message: "invalid email and password",
                success: false,
            })
        }

        const isMatch = await bcryptjs.compare(password, findUser.password);

        if(!isMatch){
            return res.status(400).json({
                message: "invalid email and password",
                success: false,
            })
        }

        const tokenData = {
            id:findUser._id,
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn: "1d"});

        const populatePost = await Promise.all(
            findUser.posts.map(async (postId) => {
                // postId valid hai ya nahi, yeh check karein
                const post = await Post.findById(postId);
        
                // check karein ki post exist karta hai ya nahi
                if (post) {
                    // console.log("****", post.author);
                    // console.log("------", findUser._id);

                    return post
        
                    // Ensure dono ObjectId hai aur .toString() use karke compare karein
                    // if (post.author.equals(findUser._id)) {
                    //     return post; // Agar match karta hai to post return karein
                    // }
                }
        
                return null; // Agar match nahi hota ya post nahi milta to null return karein
            })
        );

        // console.log(populatePost)
        
        // Array se null values ko hata denge
        const filteredPosts = populatePost.filter(post => post !== null);
        

        findUser = {
            _id: findUser._id,
            username: findUser.username,
            email: findUser.email,
            profilePicture: findUser.profilePicture,
            bio: findUser.bio,
            followers: findUser.followers,
            followings: findUser.followings,
            posts: populatePost

        }

        return res.cookie("token", token, {httpOnly: true, sameSite:"strict", maxAge: 1*24*60*1000}).json({
            message: `welcome to ${findUser.username}`,
            findUser,
            success: true,
        })

    } catch (error) {

        console.log(error)
        
    }
}

export const Logout = async (req, res) => {

    return res.status(200).cookie("token", "", {httpsOnly:true}).json({
        message: `User LOgged Out Successfully`,
        success: true,
    })

    
}