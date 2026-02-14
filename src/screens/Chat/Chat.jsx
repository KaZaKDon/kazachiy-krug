import { useReducer } from "react";
import { chatReducer, initialState } from "./chatReducer";
import { useChatSocket } from "./hooks/useChatSocket";
import DialogList from "./components/DialogList";
import ChatWindow from "./components/ChatWindow";
import { getSocket } from "../../shared/socket";

import "./chat.css";
import "../../styles/variables.css";

export default function Chat({ currentUser }) {
    const [state, dispatch] = useReducer(chatReducer, {
        ...initialState,
        activeChatUserId: null,
        chats: {}
    });

    const { users, chats, activeChatUserId, activeChatId } = state;

    const activeChat = activeChatId ? chats[activeChatId] : null;

    // 🔹 сокет (ВСЕГДА)
    useChatSocket(
        dispatch,
        currentUser,
        activeChatUserId,
        activeChatId,
        activeChat?.messages ?? []
    );


    const sendMessage = (text) => {
        if (!activeChatId) return;
        const socket = getSocket();
        if (!socket) return;

        const message = {
            id: crypto.randomUUID(),
            chatId: activeChatId,
            text,
            senderId: currentUser.id,
            fromMe: true,
            status: "sent"
        };

        socket.emit("message:send", message);



        dispatch({
            type: "RECEIVE_MESSAGE",
            payload: {
                chatId: activeChatId,
                message
            }
        });
    };

    const startTyping = () => {
        if (!activeChatId) return;
        const socket = getSocket();
        if (!socket) return;

        socket.emit("typing:start", { chatId: activeChatId });
    };

    const stopTyping = () => {
        if (!activeChatId) return;
        const socket = getSocket();
        if (!socket) return;

        socket.emit("typing:stop", { chatId: activeChatId });
    };


    return (
        <div className="chat-layout">
            <DialogList
                currentUserId={currentUser.id}
                users={users.filter((user) => user.id !== currentUser.id)}
                chats={chats}
                activeUserId={activeChatUserId}
                onSelect={(userId) => {
                    stopTyping();
                    dispatch({
                        type: "SET_ACTIVE_CHAT_USER",
                        payload: userId
                    })
                }}
            />

            <ChatWindow
                chat={activeChat}
                activeUser={users.find((user) => user.id === activeChatUserId) ?? null}
                hasSelectedChat={Boolean(activeChatUserId)}
                currentUserId={currentUser.id}

                onSend={sendMessage}
                onDraftChange={(text) =>
                    dispatch({
                        type: "SET_DRAFT",
                        payload: { chatId: activeChatId, text }
                    })
                }
                onTypingStart={startTyping}
                onTypingStop={stopTyping}

            />
        </div>
    );
}