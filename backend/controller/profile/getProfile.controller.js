import { User } from "../../modals/user.modal.js";

export const getProfile = async(req, res) => {

    //  console.log("//",req.file)

    //  console.log(req.params.id)

    try {
        const userId = req.params.id;

        let user = await User.findById(userId).populate({path: "posts", createdAt:-1}).populate("bookmarks").populate("followings").populate("followers");

        return res.status(200).json({
            user,
            success:true
        })
    } catch (error) {

        console.log(error)
    }

}