import { useState, useEffect } from "react";

export default function ChatView({ chat, onSend, onRead }) {
    const [text, setText] = useState("");

    // помечаем сообщения как прочитанные при открытии чата
    useEffect(() => {
        if (onRead) {
            onRead();
        }
    }, [chat.id]);

    const handleSend = () => {
        if (!text.trim()) return;
        onSend(text);
        setText("");
    };

    return (
        <main className="chat-view">

            <header className="chat-header">
                <h2>{chat.title}</h2>
                <span>{chat.type === "group" ? "Группа" : "Личный чат"}</span>
            </header>

            <div className="messages">
                {chat.messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`message ${msg.fromMe ? "outgoing" : "incoming"}`}
                    >
                        <span className="bubble">{msg.text}</span>

                        {msg.fromMe && (
                            <span className={`status ${msg.status}`}>
                                {msg.status === "sent" && "✓"}
                                {(msg.status === "delivered" || msg.status === "read") && "✓✓"}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <footer className="chat-input">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Сообщение..."
                />
                <button onClick={handleSend}>➤</button>
            </footer>

        </main>
    );
}