import cloudinary from "../../utils/cloudanry.js";
import getDataUri from "../../utils/dataUri.js";
import { User } from "../../modals/user.modal.js";

export const editProfile = async(req, res) => {

   
    try {

        const userId = req.id;
        
        const {bio, gender} = req.body;
        
        const profilePicture = req.file;

        console.log("LLLLLLLLLLLL",profilePicture)

        let cloudResponse;

        if(profilePicture){

            const fileUri = getDataUri(profilePicture);

            // console.log(fileUri)

            cloudResponse = await cloudinary.uploader.upload(fileUri)
        }

        // console.log(cloudResponse.secure_url)

        const user = await User.findById(userId);

        if(!user){

            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }

        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: "profile updated",
            success: true,
            user
        })
        
    } catch (error) {
        console.log(error);
    }
}