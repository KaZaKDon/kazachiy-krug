export default function ChatList({
    chats,
    activeChatId,
    onSelect,
    onNewChat,
    onNewGroup
}) {
    return (
        <aside className="chat-list">

            <div className="chat-actions">
                <button onClick={onNewChat}>Новый чат</button>
                <button onClick={onNewGroup}>Новая группа</button>
            </div>

            {chats.length === 0 && (
                <div className="empty">
                    Нет чатов
                </div>
            )}

            {chats.map(chat => (
                <div
                    key={chat.id}
                    className={`chat-item ${chat.id === activeChatId ? "active" : ""}`}
                    onClick={() => onSelect(chat.id)}
                >
                    <div className="chat-title">{chat.title}</div>
                    <div className="chat-type">
                        {chat.type === "group" ? "Группа" : "Чат"}
                    </div>
                </div>
            ))}

        </aside>
    );
}