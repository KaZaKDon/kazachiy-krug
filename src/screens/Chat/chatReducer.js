export const initialState = {
    users: [],

    chats: {
        /*
        chatId: {
            id: chatId,
            messages: [],
            draft: ""
        }
        */
    },

    activeChatUserId: null,
    activeChatId: null
};

function ensureChat(state, chatId) {
    if (state.chats[chatId]) return state.chats;

    return {
        ...state.chats,
        [chatId]: {
            id: chatId,
            messages: [],
            draft: "",
            typingUsers: []
        }
    };
}

function updateMessageStatus(chat, messageId, status) {
    if (!chat) return chat;

    const messages = chat.messages.map((message) => {
        if (message.id !== messageId) return message;
        if (message.status === status) return message;
        return {
            ...message,
            status
        };
    });

    return {
        ...chat,
        messages
    };
}


export function chatReducer(state, action) {
    switch (action.type) {

        // ---------- USERS ----------
        case "SET_USERS":
            return {
                ...state,
                users: action.payload
            };

        // ---------- ACTIVE CHAT ----------
        case "SET_ACTIVE_CHAT_USER":
            return {
                ...state,
                activeChatUserId: action.payload
            };
        
        case "SET_ACTIVE_CHAT": {
            const { chatId, messages = [] } = action.payload;
            const chats = ensureChat(state, chatId);

            return {
                ...state,
                activeChatId: chatId,
                chats: {
                    ...chats,
                    [chatId]: {
                        ...chats[chatId],
                        messages,
                        typingUsers: chats[chatId].typingUsers ?? []
                    }
                }
            };
        }



        // ---------- DRAFT ----------
        case "SET_DRAFT": {
            const { chatId, text } = action.payload;

            const chats = ensureChat(state, chatId);

            return {
                ...state,
                chats: {
                    ...chats,
                    [chatId]: {
                        ...chats[chatId],
                        draft: text
                    }
                }
            };
        }

        // ---------- MESSAGES ----------
        case "RECEIVE_MESSAGE": {
            const { chatId, message } = action.payload;
            if (!chatId || !message?.id) return state;

            const chats = ensureChat(state, chatId);
            const chat = chats[chatId];

            // защита от дублей
            if (chat.messages.some(m => m.id === message.id)) {
                return state;
            }

            return {
                ...state,
                chats: {
                    ...chats,
                    [chatId]: {
                        ...chat,
                        messages: [...chat.messages, message]
                    }
                }
            };
        }

        case "UPDATE_MESSAGE_STATUS": {
            const { chatId, messageId, status } = action.payload;
            if (!chatId || !messageId || !status) return state;

            const chats = ensureChat(state, chatId);
            const chat = chats[chatId];

            return {
                ...state,
                chats: {
                    ...chats,
                    [chatId]: updateMessageStatus(chat, messageId, status)
                }
            };
        }

        case "UPDATE_USER_STATUS": {
            const { userId, isOnline } = action.payload;
            if (!userId) return state;

            return {
                ...state,
                users: state.users.map((user) =>
                    user.id === userId
                        ? { ...user, isOnline: Boolean(isOnline) }
                        : user
                )
            };
        }

        case "SET_TYPING": {
            const { chatId, userId } = action.payload;
            if (!chatId || !userId) return state;

            const chats = ensureChat(state, chatId);
            const chat = chats[chatId];
            const typingUsers = chat.typingUsers ?? [];

            if (typingUsers.includes(userId)) return state;

            return {
                ...state,
                chats: {
                    ...chats,
                    [chatId]: {
                        ...chat,
                        typingUsers: [...typingUsers, userId]
                    }
                }
            };
        }

        case "CLEAR_TYPING": {
            const { chatId, userId } = action.payload;
            if (!chatId || !userId) return state;

            const chats = ensureChat(state, chatId);
            const chat = chats[chatId];
            const typingUsers = chat.typingUsers ?? [];

            if (!typingUsers.includes(userId)) return state;

            return {
                ...state,
                chats: {
                    ...chats,
                    [chatId]: {
                        ...chat,
                        typingUsers: typingUsers.filter((id) => id !== userId)
                    }
                }
            };
        }



        default:
            return state;
    }
}