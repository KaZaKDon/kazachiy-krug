import { useEffect, useRef } from "react"; 

export default function ChatWindow({
    chat,
    activeUser,
    hasSelectedChat,
    currentUserId,
    onSend,
    onDraftChange,
    onTypingStart,
    onTypingStop

}) {
    const endRef = useRef(null);
    const typingRef = useRef(false);
    const stopTypingTimeout = useRef(null);

    useEffect(() => {
        if (!endRef.current) return;
        endRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
    }, [chat?.messages?.length]);

    const stopTypingNow = () => {
        if (stopTypingTimeout.current) {
            clearTimeout(stopTypingTimeout.current);
        }

        if (typingRef.current) {
            typingRef.current = false;
            onTypingStop?.();
        }
    };

    useEffect(() => {
        const handleWindowBlur = () => {
            stopTypingNow();
        };

        window.addEventListener("blur", handleWindowBlur);

        return () => {
            window.removeEventListener("blur", handleWindowBlur);
            stopTypingNow();
        };
    }, []);

    useEffect(() => {
        stopTypingNow();
    }, [chat?.id]);

    const handleChange = (event) => {
        const value = event.target.value;
        onDraftChange?.(value);

        if (!chat) return;

        if (!value.trim()) {
            stopTypingNow();
            return;
        }

        if (!typingRef.current) {
            typingRef.current = true;
            onTypingStart?.();
        }

        if (stopTypingTimeout.current) {
            clearTimeout(stopTypingTimeout.current);
        }

        stopTypingTimeout.current = setTimeout(() => {
            stopTypingNow();
        }, 1200);
    };

    const handleSend = () => {
        if (!chat?.draft?.trim()) return;
        onSend(chat.draft);
        onDraftChange?.("");
        stopTypingNow();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    const chatType = chat?.type ?? "private";
    const onlineCount = hasSelectedChat
        ? (chatType === "group"
            ? (chat?.onlineCount ?? 0)
            : (activeUser?.isOnline ? 1 : 0))
        : 0;

    const subtitle = hasSelectedChat
        ? `${onlineCount} онлайн`
        : "личный чат";




    return (
        <section className="chat-window">
            <header className="chat-header">
                <div className="chat-header-main">
                    <div className="chat-avatar" aria-hidden="true" />
                    <div className="chat-header-text">
                        <h2>{hasSelectedChat ? (activeUser?.name ?? "Чат") : "Чат не выбран"}</h2>
                        <span className="chat-type">{subtitle}</span>
                    </div>
                </div>
                <div className="chat-header-actions">
                    <button type="button" aria-label="search">⌕</button>
                    <button type="button" aria-label="menu">⋯</button>
                </div>
            </header>

            {chat?.typingUsers?.length ? (
                    <span className="chat-typing">печатает...</span>
                ) : null}

            <div className="messages">
                    {!hasSelectedChat ? (
                        <div className="chat-empty-placeholder">
                            Выберите контакт слева, чтобы начать диалог
                        </div>
                    ) : null}
                    {chat?.messages.map((m) => {
                        const hasSender = Boolean(m.senderId);
                        const isMe = hasSender
                            ? m.senderId === currentUserId
                            : m.fromMe === true;

                        return (
                            <div
                                key={m.id}
                                className={`message ${isMe ? "outgoing" : "incoming"}`}
                            >
                                <div className="bubble">{m.text}</div>
                                {isMe && m.status && (
                                    <div className={`message-status ${m.status}`}>
                                        {m.status === "sent" && "✓"}
                                        {(m.status === "delivered" || m.status === "read") && "✓✓"}
                                </div>
                                )}
                            </div>
                        );
                    })}
                <div ref={endRef} />
            </div>

            <footer className="chat-input">
                <textarea
                    value={chat?.draft ?? ""}
                    disabled={!chat || !hasSelectedChat}
                    onChange={handleChange}
                    onBlur={stopTypingNow}
                    onKeyDown={handleKeyDown}
                    placeholder="Сообщение..."
                    rows={1}
                />
                <button
                    disabled={!chat || !hasSelectedChat}
                    onClick={handleSend}
                >
                    ➤
                </button>
            </footer>
        </section>
    );
}