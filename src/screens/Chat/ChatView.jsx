import MessageInput from "./MessageInput";

export default function ChatView({
    chat,
    onSend,
    onDraftChange,
    onTyping,
    onStopTyping
}) {
    // ОБЯЗАТЕЛЬНАЯ защита
    if (!chat) {
        return (
            <main className="chat-view chat-empty">
                <div className="chat-placeholder">
                    Выберите чат
                </div>
            </main>
        );
    }

    const {
        title,
        typingUsers = [],
        messages = [],
        type
    } = chat;

    return (
        <main className="chat-view">

            <header className="chat-header">
                <h2>{title}</h2>

                {typingUsers.length > 0 && (
                    <span className="typing">
                        {typingUsers.map(u => u.name).join(", ")} печатает…
                    </span>
                )}
            </header>

            <div className="messages">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`message ${msg.fromMe ? "outgoing" : "incoming"}`}
                    >
                        {!msg.fromMe && type === "group" && (
                            <div className="message-author">
                                {msg.sender.name}
                            </div>
                        )}

                        <div className="message-text">
                            {msg.text}
                        </div>

                        {msg.fromMe && msg.status && (
                            <div className={`message-status ${msg.status}`}>
                                {msg.status === "sent" && "✓"}
                                {msg.status === "delivered" && "✓✓"}
                                {msg.status === "read" && "✓✓"}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <MessageInput
                chat={chat}
                onSend={onSend}
                onDraftChange={onDraftChange}
                onTyping={onTyping}
                onStopTyping={onStopTyping}
            />

        </main>
    );
}