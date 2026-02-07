export const usersById = {
    "user-1": {
        id: "user-1",
        name: "Казак",
        phone: "+79515220669",
        avatar: null,
        isOnline: true
    },
    "user-2": {
        id: "user-2",
        name: "Наташа",
        phone: "+79515260822",
        avatar: null,
        isOnline: true
    }
};

/**
 * Утилиты (чистые, без мутаций)
 */

export function getUserById(userId) {
    return usersById[userId] ?? null;
}

export function getUserName(userId) {
<<<<<<< HEAD
    return usersById[userId]?.name ?? "Наташа";
=======
    return usersById[userId]?.name ?? "Собеседник";
>>>>>>> e776f2ce9223cc25dc5562c1969385dcc0b6c9dd
}