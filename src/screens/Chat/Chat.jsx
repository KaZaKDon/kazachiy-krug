import { useState } from "react";
import ChatList from "./ChatList";
import ChatView from "./ChatView";
import CreateChat from "./CreateChat";
import "./chat.css";

export default function Chat() {
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [mode, setMode] = useState("list");
    // list | chat | create-chat | create-group

    const activeChat = chats.find(c => c.id === activeChatId);

    // ======================
    // DELIVERED -> READ
    // ======================
    const markAsRead = () => {
        if (!activeChat) return;

        let hasUpdates = false;

        const updatedMessages = activeChat.messages.map(msg => {
            if (msg.fromMe && msg.status === "delivered") {
                hasUpdates = true;
                return { ...msg, status: "read" };
            }
            return msg;
        });

        if (!hasUpdates) return;

        setChats(prev =>
            prev.map(chat =>
                chat.id === activeChat.id
                    ? { ...chat, messages: updatedMessages }
                    : chat
            )
        );
    };

    // ======================
    // CREATE CHAT / GROUP
    // ======================
    const createChat = (title, type) => {
        const newChat = {
            id: Date.now().toString(),
            title,
            type,
            messages: []
        };

        setChats(prev => [...prev, newChat]);
        setActiveChatId(newChat.id);
        setMode("chat");
    };

    // ======================
    // SEND MESSAGE
    // ======================
    const sendMessage = (text) => {
    if (!activeChat || !text.trim()) return;

    const messageId = Date.now();

    const newMessage = {
        id: messageId,
        text,
        fromMe: true,
        status: "sent"
    };

    setChats(prev =>
        prev.map(chat =>
            chat.id === activeChat.id
                ? { ...chat, messages: [...chat.messages, newMessage] }
                : chat
        )
    );

    // ⏱ доставлено
    setTimeout(() => {
        setChats(prev =>
            prev.map(chat =>
                chat.id === activeChat.id
                    ? {
                        ...chat,
                        messages: chat.messages.map(msg =>
                            msg.id === messageId
                                ? { ...msg, status: "delivered" }
                                : msg
                        )
                    }
                    : chat
                )
            );
        }, 800);
    };

    return (
        <div className="chat-layout">
            <ChatList
                chats={chats}
                activeChatId={activeChatId}
                onSelect={(id) => {
                    setActiveChatId(id);
                    setMode("chat");
                }}
                onNewChat={() => setMode("create-chat")}
                onNewGroup={() => setMode("create-group")}
            />

            {mode === "create-chat" && (
                <CreateChat
                    title="Новый чат"
                    onCreate={(name) => createChat(name, "private")}
                    onCancel={() => setMode("list")}
                />
            )}

            {mode === "create-group" && (
                <CreateChat
                    title="Новая группа"
                    onCreate={(name) => createChat(name, "group")}
                    onCancel={() => setMode("list")}
                />
            )}

            {mode === "chat" && activeChat && (
                <ChatView
                    chat={activeChat}
                    onSend={sendMessage}
                    onRead={markAsRead}
                />
            )}
        </div>
    );
}