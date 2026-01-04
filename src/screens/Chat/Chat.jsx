import { useReducer, useEffect } from "react";
import ChatList from "./ChatList";
import ChatView from "./ChatView";
import CreateChat from "./CreateChat";
import { chatReducer, initialState } from "./chatReducer";
import "./chat.css";
import { socket } from "../../shared/socket";

export default function Chat() {
    const CURRENT_USER = {
        id: "user-1",
        name: "Казак"
    };

    const [state, dispatch] = useReducer(chatReducer, initialState);

    const activeChat = state.chats.find(
        chat => chat.id === state.activeChatId
    );

    /* =====================
       JOIN CHAT
    ===================== */
    useEffect(() => {
        if (!state.activeChatId) return;

        socket.emit("join:chat", { chatId: state.activeChatId });

    }, [state.activeChatId]);

    /* =====================
       RECEIVE MESSAGES
    ===================== */
    useEffect(() => {
        socket.on("message:new", (message) => {
            dispatch({
                type: "RECEIVE_MESSAGE",
                payload: {
                    chatId: message.chatId,
                    text: message.text,
                    sender: message.sender
                }
            });
        });

        return () => {
            socket.off("message:new");
        };
    }, []);

    /* =====================
       TYPING
    ===================== */
    useEffect(() => {
        socket.on("typing:start", ({ chatId, userId }) => {
            dispatch({
                type: "SET_TYPING",
                payload: {
                    chatId,
                    user: { id: userId, name: "Собеседник" }
                }
            });
        });

        socket.on("typing:stop", ({ chatId, userId }) => {
            dispatch({
                type: "CLEAR_TYPING",
                payload: {
                    chatId,
                    userId
                }
            });
        });

        return () => {
            socket.off("typing:start");
            socket.off("typing:stop");
        };
    }, []);

    /* =====================
       SEND MESSAGE
    ===================== */
    const sendMessage = (text) => {
        socket.emit("message:send", {
            chatId: state.activeChatId,
            text,
            sender: CURRENT_USER
        });
    };

    return (
        <div className="chat-layout">
            <ChatList
                chats={state.chats}
                activeChatId={state.activeChatId}
                onSelect={(id) =>
                    dispatch({ type: "SET_ACTIVE_CHAT", payload: id })
                }
                onNewChat={() =>
                    dispatch({ type: "SET_MODE", payload: "create-chat" })
                }
                onNewGroup={() =>
                    dispatch({ type: "SET_MODE", payload: "create-group" })
                }
                onTogglePin={(chatId) =>
                    dispatch({ type: "TOGGLE_PIN_CHAT", payload: chatId })
                }
                onToggleMute={(chatId) =>
                    dispatch({ type: "TOGGLE_MUTE_CHAT", payload: chatId })
                }
            />

            {activeChat && (
                <ChatView
                    chat={activeChat}
                    onSend={sendMessage}
                    onDraftChange={(text) =>
                        dispatch({
                            type: "SET_DRAFT",
                            payload: {
                                chatId: activeChat.id,
                                text
                            }
                        })
                    }
                    onTyping={() =>
                        socket.emit("typing:start", {
                            chatId: activeChat.id
                        })
                    }
                    onStopTyping={() =>
                        socket.emit("typing:stop", {
                            chatId: activeChat.id
                        })
                    }
                />
            )}

            {state.mode === "create-chat" && (
                <CreateChat
                    title="Новый чат"
                    onCreate={(title) =>
                        dispatch({
                            type: "CREATE_CHAT",
                            payload: { title, type: "private" }
                        })
                    }
                    onCancel={() =>
                        dispatch({ type: "SET_MODE", payload: "list" })
                    }
                />
            )}

            {state.mode === "create-group" && (
                <CreateChat
                    title="Новая группа"
                    onCreate={(title) =>
                        dispatch({
                            type: "CREATE_CHAT",
                            payload: { title, type: "group" }
                        })
                    }
                    onCancel={() =>
                        dispatch({ type: "SET_MODE", payload: "list" })
                    }
                />
            )}
        </div>
    );
}