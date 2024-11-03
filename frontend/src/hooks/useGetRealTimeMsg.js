// import { setMessages } from "../../redux/chatSlice.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMsg } from "../../redux/chatSlice.js";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socketio);
    const { msg } = useSelector(store => store.chat);
    useEffect(() => {
        socket?.on('newMessage', (newMessage) => {
            dispatch(setMsg([...msg, newMessage]));
        })

        return () => {
            socket?.off('newMessage');
        }
    }, [msg, setMsg]);
};
export default useGetRTM;