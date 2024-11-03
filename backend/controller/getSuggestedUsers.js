import { User } from "../modals/user.modal.js"

export const getSuggestedUser = async(req, res) => {

    try {
        const getSuggestedUser = await User.find({_id:{$ne:req.id}}).select("-password");

    if(!getSuggestedUser){

        return res.status(400).json({
            message: "Currently Do Not Have Any Users",
            success: false,
            
        })
    }

    if(getSuggestedUser){
        return res.status(200).json({
            success: true,
            users:getSuggestedUser,
            
        })
    }
    } catch (error) {
        console.log(error)
    }
}