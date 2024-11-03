import { User } from "../modals/user.modal.js";

export const followOrUnfollow = async (req, res) => {
    const meriId = req.id;
    const jiskoMeFollowKrunga = req.params.id;

    const user = await User.findById(meriId);
    const targetUser = await User.findById(jiskoMeFollowKrunga);

    if (!user || !targetUser) {
        return res.status(401).json({
            message: "User Not Found",
            success: false,
        });
    }

    const isFollowing = user.followings.includes(jiskoMeFollowKrunga);

    if (isFollowing) {
        await Promise.all([
            User.updateOne({ _id: meriId }, { $pull: { followings: jiskoMeFollowKrunga } }),
            User.updateOne({ _id: jiskoMeFollowKrunga }, { $pull: { followers: meriId } })
        ]);

        const updatedUser = await User.findById(meriId).lean(); // lean() ka use yaha kiya hai
        const targetedUser = await User.findById(jiskoMeFollowKrunga).populate({path: "posts", createdAt:-1}).populate("bookmarks")
        return res.status(200).json({
            message: "unfollow",
            success: true,
            user: updatedUser,
            targetedUser
        });
    } else {
        await Promise.all([
            User.updateOne({ _id: meriId }, { $push: { followings: jiskoMeFollowKrunga } }),
            User.updateOne({ _id: jiskoMeFollowKrunga }, { $push: { followers: meriId } })
        ]);

        const updatedUser = await User.findById(meriId).lean(); // lean() ka use yaha bhi kiya hai

        const targetedUser = await User.findById(jiskoMeFollowKrunga).populate({path: "posts", createdAt:-1}).populate("bookmarks")
        return res.status(200).json({
            message: "follow",
            success: true,
            user: updatedUser,
            targetedUser,
        });
    }
};
