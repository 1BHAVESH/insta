import jwt from "jsonwebtoken";

export const isAuthnticated = async(req, res, next) => {

    
    try {
        const token = req.cookies.token;

        // console.log(token, "==",  process.env.SECRET_KEY)
        
        if(!token){
            return res.status(401).json({
                message:"User Not Autherzied",
                success: false
            })
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY);

        

        if(!decode){
            return res.status(401).json({
                message:"Invalid",
                success:false,
            })
        }

        

        req.id = decode.id;

        console.log(req.id);

        next()
    } catch (error) {

        console.log(error)
        
    }
}