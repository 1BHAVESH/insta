import { Conversation } from "../../modals/convesation.modal.js";
import { Message } from "../../modals/message.modal.js";
import { getReciverSocketId, io } from "../../socket/socket.js";

export const sendMessage = async(req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id
        const {message} = req.body;

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]} 
        })

        // estqablish a connection if not started yet

        if(!conversation){
            conversation  = await Conversation.create({
                participants:[senderId, receiverId]
            })
        }

        const newMessage =  await Message.create({
            senderId,
            receiverId,
            message,
        }) 

        if(newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);

        const receverSocketId = getReciverSocketId(receiverId)

        if(receverSocketId){
            io.to(receverSocketId).emit("newMessage", newMessage)
        }

        return res.status(201).json({
            success:true,
            newMessage
        })
    } catch (error) {
        console.log(error)
    }
}