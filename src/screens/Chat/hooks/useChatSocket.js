import { useEffect } from "react";
import { socket } from "../../../shared/socket";

const FIXED_CHAT_ID = "room-1";

export function useChatSocket(dispatch, currentUser) {
    useEffect(() => {
        if (!currentUser?.id) return;

        socket.emit("join:chat", { chatId: FIXED_CHAT_ID });

        const onNewMessage = (message) => {
            if (message.chatId !== FIXED_CHAT_ID) return;

            dispatch({
                type: "RECEIVE_MESSAGE",
                payload: {
                    chatId: message.chatId,
                    message: {
                        id: message.id,
                        text: message.text,
                        senderId: message.senderId,
                        senderName: message.senderName ?? "Собеседник",
                        fromMe: message.sender.id === currentUser.id
                    }
                }
            });
        };


        const onTypingStart = ({ chatId, userId }) => {
            if (chatId !== FIXED_CHAT_ID) return;
            if (userId === currentUser.id) return;

            dispatch({
                type: "SET_TYPING",
                payload: {
                    chatId,
                    user: {
                        id: userId,
                        name: "Собеседник"
                    }
                }
            });
        };

        const onTypingStop = ({ chatId, userId }) => {
            if (chatId !== FIXED_CHAT_ID) return;

            dispatch({
                type: "CLEAR_TYPING",
                payload: {
                    chatId,
                    userId
                }
            });
        };

        socket.on("message:new", onNewMessage);
        socket.on("typing:start", onTypingStart);
        socket.on("typing:stop", onTypingStop);

        return () => {
            socket.off("message:new", onNewMessage);
            socket.off("typing:start", onTypingStart);
            socket.off("typing:stop", onTypingStop);
        };
    }, [currentUser?.id, dispatch]);
}