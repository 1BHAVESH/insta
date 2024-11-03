import { Conversation } from "../../modals/convesation.modal.js";
import { getReciverSocketId, io } from "../../socket/socket.js";

export const getMessage = async(req, res) => {

    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        // console.log(senderId)
        // console.log(receiverId)

        const conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]}
        }).populate("messages")

        if(!conversation) return res.status(200).json({success:true, messages:[]});

        if(senderId != receiverId){

            const msgSocektId = getReciverSocketId(receiverId);

            const msg = {
                senderId,
                messages:conversation?.messages
            } 
            // console.log("nnnnnnnnnnnnnnnnaaaaaaaaa",msg)

            if(msgSocektId){
                io.to(msgSocektId).emit("mssg", msg)
            }
        }

        return res.status(200).json({success:true, messages:conversation?.messages});
    } catch (error) {
        console.log(error)
    }
}