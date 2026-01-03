export const initialState = {
    chats: [],
    activeChatId: null,
    mode: "list" // list | chat | create-chat | create-group
};

export function chatReducer(state, action) {
    switch (action.type) {

        case "CREATE_CHAT": {

            const newChat = {
                id: crypto.randomUUID(),
                title: action.payload.title,
                type: action.payload.type,
                messages: [],
                unread: 0,
                muted: false,
                pinned: false,
                draft: "",
                typingUsers: [],
                lastMessage: null,
                lastMessageAt: null
            };

            return {
                ...state,
                chats: [...state.chats, newChat],
                activeChatId: newChat.id,
                mode: "chat"
            };
        }

        case "SET_ACTIVE_CHAT":
            return {
                ...state,
                activeChatId: action.payload,
                mode: "chat",
                chats: state.chats.map(chat =>
                    chat.id === action.payload
                        ? { ...chat, unread: 0 }
                        : chat
                )
            };

        case "SEND_MESSAGE":
            return {
                ...state,
                chats: state.chats.map(chat =>
                    chat.id === state.activeChatId
                        ? {
                            ...chat,
                            messages: [
                                ...chat.messages,
                                {
                                    id: action.payload.messageId,
                                    text: action.payload.text,
                                    senderId: action.payload.sender.id,
                                    senderName: action.payload.sender.name,
                                    fromMe: true,
                                    status: "sent",
                                    createdAt: Date.now()
                                }
                            ],
                            lastMessage: action.payload.text,
                            lastMessageAt: Date.now()
                        }
                        : chat
                )
            };

        case "RECEIVE_MESSAGE":
            return {
                ...state,
                chats: state.chats.map(chat =>
                    chat.id === action.payload.chatId
                        ? {
                            ...chat,
                            messages: [
                                ...chat.messages,
                                {
                                    id: crypto.randomUUID(),
                                    text: action.payload.text,
                                    senderId: action.payload.sender.id,
                                    senderName: action.payload.sender.name,
                                    fromMe: false,
                                    createdAt: Date.now()
                                }
                            ],
                            lastMessage: action.payload.text,
                            lastMessageAt: Date.now(),
                            unread:
                                chat.id === state.activeChatId || chat.muted
                                    ? chat.unread
                                    : chat.unread + 1
                        }
                        : chat
                )
            };

        case "SET_MODE":
            return { ...state, mode: action.payload };

        case "UPDATE_MESSAGE_STATUS":
            return {
                ...state,
                chats: state.chats.map(chat =>
                    chat.id === action.payload.chatId
                        ? {
                            ...chat,
                            messages: chat.messages.map(msg =>
                                msg.id === action.payload.messageId
                                    ? { ...msg, status: action.payload.status }
                                    : msg
                            )
                        }
                        : chat
                )
            };
        case "TOGGLE_PIN_CHAT":
        return {
            ...state,
            chats: state.chats.map(chat =>
                chat.id === action.payload
                    ? { ...chat, pinned: !chat.pinned }
                    : chat
            )
        };
    case "TOGGLE_MUTE_CHAT":
        return {
            ...state,
            chats: state.chats.map(chat =>
                chat.id === action.payload
                    ? { ...chat, muted: !chat.muted }
                    : chat
            )
        };
    case "SET_DRAFT":
        return {
            ...state,
            chats: state.chats.map(chat =>
                chat.id === action.payload.chatId
                    ? { ...chat, draft: action.payload.text }
                    : chat
            )
        };

    case "CLEAR_DRAFT":
        return {
            ...state,
            chats: state.chats.map(chat =>
                chat.id === action.payload
                    ? { ...chat, draft: "" }
                    : chat
            )
        };

        case "SET_TYPING": {
            const { chatId, user } = action.payload;
                return {
                    ...state,
                    chats: state.chats.map(chat =>
                        chat.id === chatId
                            ? {
                                ...chat,
                                typingUsers: chat.typingUsers.some(
                                    u => u.id === user.id
                                )
                                    ? chat.typingUsers
                                    : [...chat.typingUsers, user]
                            }
                            : chat
                    )
                };
            }

        case "CLEAR_TYPING":
            return {
                ...state,
                chats: state.chats.map(chat =>
                    chat.id === action.payload.chatId
                        ? {
                            ...chat,
                            typingUsers: chat.typingUsers.filter(
                                u => u.id !== action.payload.userId
                            )
                        }
                        : chat
                )
            };

        default:
            return state;
    }
}