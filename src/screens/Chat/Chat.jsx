import { useReducer } from "react";
import ChatList from "./ChatList";
import ChatView from "./ChatView";
import CreateChat from "./CreateChat";
import { chatReducer, initialState } from "./chatReducer";
import "./chat.css";


export default function Chat() {

    const CURRENT_USER = {
        id: "user-1",
        name: "Казак"
    };

    const [state, dispatch] = useReducer(chatReducer, initialState);

    const activeChat = state.chats.find(
        chat => chat.id === state.activeChatId
    );

    const sendMessage = (text) => {
        const messageId = crypto.randomUUID();

        dispatch({
            type: "SEND_MESSAGE",
            payload: { text, messageId, sender: CURRENT_USER }
        });

        // delivered
        setTimeout(() => {
            dispatch({
                type: "UPDATE_MESSAGE_STATUS",
                payload: {
                    chatId: state.activeChatId,
                    messageId,
                    status: "delivered"
                }
            });
        }, 800);

        // read
        setTimeout(() => {
            dispatch({
                type: "UPDATE_MESSAGE_STATUS",
                payload: {
                    chatId: state.activeChatId,
                    messageId,
                    status: "read"
                }
            });
        }, 1500);
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
                    dispatch({
                        type: "TOGGLE_PIN_CHAT",
                        payload: chatId
                    })
                }
                onToggleMute={(chatId) =>
                    dispatch({
                        type: "TOGGLE_MUTE_CHAT",
                        payload: chatId
                    })
                }
            />

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
                    dispatch({
                        type: "SET_TYPING",
                        payload: {
                            chatId: activeChat.id,
                            user: CURRENT_USER
                        }
                    })
                }
                onStopTyping={() =>
                    dispatch({
                        type: "CLEAR_TYPING",
                        payload: {
                            chatId: activeChat.id,
                            userId: CURRENT_USER.id
                        }
                    })
                }
            />

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

            {state.mode === "chat" && activeChat && (
                <ChatView
                    chat={activeChat}
                    onSend={sendMessage}
                    onReceive={(text) =>
                        dispatch({
                            type: "RECEIVE_MESSAGE",
                            payload: {
                                chatId: activeChat.id,
                                text,
                                sender: {
                                    id: "user-2",
                                    name: activeChat.type === "group"
                                        ? "Атаман"
                                        : activeChat.title
                                }
                            }
                        })
                    }
                />
            )}
            <button
                onClick={() =>
                    dispatch({
                        type: "RECEIVE_MESSAGE",
                        payload: {
                            chatId: activeChat.id,
                            text: "Привет! Я собеседник",
                            sender: { id: "u2", name: "Казак" }
                        }
                    })
                }
            >
                + Входящее
            </button>

        </div>
    );
}