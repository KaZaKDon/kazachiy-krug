export const initialState = {
    chats: [
        {
            id: "room-1",
            title: "Общий чат",
            type: "group",
            messages: [],
            draft: "",
            typingUsers: [],
            unread: 0,
            pinned: false,
            muted: false
        }
    ],
    activeChatId: "room-1",
    mode: "list"
};

export function chatReducer(state, action) {
    switch (action.type) {

        case "UPSERT_CHAT": {
            const chat = action.payload;

            const exists = state.chats.some(c => c.id === chat.id);

            return exists
                ? state
                : {
                    ...state,
                    chats: [...state.chats, chat]
                };
        }

        case "SET_ACTIVE_CHAT":
            return {
                ...state,
                activeChatId: action.payload
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

        case "RECEIVE_MESSAGE": {
            const { chatId, message } = action.payload;

            return {
                ...state,
                chats: state.chats.map(chat => {
                    if (chat.id !== chatId) return chat;

                    // 🔒 ЗАЩИТА ОТ ДУБЛЕЙ
                    if (chat.messages.some(m => m.id === message.id)) {
                        return chat;
                    }

                    return {
                        ...chat,
                        messages: [...chat.messages, message],
                        unread: message.fromMe ? chat.unread : chat.unread + 1
                    };
                })
            };
        }

        case "SET_TYPING":
            return {
                ...state,
                chats: state.chats.map(chat => {
                    if (chat.id !== action.payload.chatId) return chat;

                    const exists = chat.typingUsers.some(
                        u => u.id === action.payload.user.id
                    );

                    return exists
                        ? chat
                        : {
                            ...chat,
                            typingUsers: [...chat.typingUsers, action.payload.user]
                        };
                })
            };

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

        case "SET_MODE":
            return {
                ...state,
                mode: action.payload
            };

        default:
            return state;
    }
}