import sharp from "sharp"
import { Post } from "../../modals/post.modal.js";
import { User } from "../../modals/user.modal.js";
import cloudinary from "../../utils/cloudanry.js";

export const createPost = async (req, res) => {

    try {
        const {caption} = req.body;
    const image = req.file;
    const authorId = req.id;

    if(!image){
        return res.status(400).json({
            mesaage:"image reqaired",
           
        })
    }

    const optimizeImageSize = await sharp(image.buffer)
    .resize({width:800, height:800, fit: "cover"})
    .toFormat("jpeg", {quality:80})
    .toBuffer()

    console.log("666666666",optimizeImageSize)

    const fileUri = `data:image/jpeg;base64,${optimizeImageSize.toString('base64')}`

    let cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
        caption,
        image:cloudResponse.secure_url,
        author:authorId
    })

    const user = await User.findById(authorId);

    if(user){

         user.posts.push(post._id);

        await user.save()
    }

    const posts = await post.populate({path:"author", select:"-password"});

    

    // console.log(posts.author.username)

    return res.status(201).json({
        mesaage:"new post created",
        posts,
        success:true,
       
    })


    } catch (error) {
        
        console.log(error)
    }
}