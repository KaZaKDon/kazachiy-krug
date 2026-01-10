import { useReducer, useEffect } from "react";
import ChatList from "./ChatList";
import ChatView from "./ChatView";
import { chatReducer, initialState } from "./chatReducer";
import { useChatSocket } from "./hooks/useChatSocket";
import { socket } from "../../shared/socket";
import "./chat.css";

const FIXED_CHAT_ID = "room-1";

export default function Chat() {
    const CURRENT_USER = {
        id: "user-1",
        name: "Казак"
    };

    const [state, dispatch] = useReducer(chatReducer, initialState);

    // создаём чат ОДИН раз
    useEffect(() => {
        if (state.chats.length === 0) {
            dispatch({
                type: "CREATE_CHAT",
                payload: {
                    id: FIXED_CHAT_ID,
                    title: "Общий чат",
                    type: "group"
                }
            });
        }
    }, [state.chats.length]);

    const activeChat = state.chats.find(
        chat => chat.id === state.activeChatId
    );

    useChatSocket(dispatch, CURRENT_USER);

    const sendMessage = (text) => {
        const messageId = crypto.randomUUID();

        const message = {
            id: messageId,
            chatId: FIXED_CHAT_ID,
            text,
            sender: {
                id: CURRENT_USER.id,
                name: CURRENT_USER.name
            }
        };

        // оптимистичное добавление
        dispatch({
            type: "RECEIVE_MESSAGE",
            payload: {
                chatId: FIXED_CHAT_ID,
                message: {
                    ...message,
                    fromMe: true,
                    status: "sent"
                }
            }
        });

        socket.emit("message:send", message);
    };

    const handleTypingStart = () => {
        socket.emit("typing:start", {
            chatId: FIXED_CHAT_ID,
            userId: CURRENT_USER.id
        });
    };

    const handleTypingStop = () => {
        socket.emit("typing:stop", {
            chatId: FIXED_CHAT_ID,
            userId: CURRENT_USER.id
        });
    };

    if (!activeChat) return null;

    return (
        <div className="chat-layout">
            <ChatList
                chats={state.chats}
                activeChatId={state.activeChatId}
                onSelect={() => {}}
                onNewChat={() => {}}
                onNewGroup={() => {}}
                onTogglePin={() => {}}
                onToggleMute={() => {}}
            />

            <ChatView
                chat={activeChat}
                onSend={sendMessage}
                onTyping={handleTypingStart}
                onStopTyping={handleTypingStop}
                onDraftChange={(text) =>
                    dispatch({
                        type: "SET_DRAFT",
                        payload: {
                            chatId: FIXED_CHAT_ID,
                            text
                        }
                    })
                }
            />
        </div>
    );
}
            