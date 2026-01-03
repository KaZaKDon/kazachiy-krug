export default function ChatWindow() {
    return (
        <section className="chat-window">

            <header className="chat-header">
                <div>
                    <h2>Атаман</h2>
                    <span className="chat-type">личный чат</span>
                </div>

                <div className="chat-actions">
                    <button>📞</button>
                    <button>⋯</button>
                </div>
            </header>

            <div className="chat-messages">
                <div className="message incoming">
                    <div className="bubble">
                        Собрание сегодня в 20:00
                    </div>
                </div>

                <div className="message outgoing">
                    <div className="bubble">
                        Принял
                    </div>
                    <span className="message-status read">✓✓</span>
                </div>
            </div>

            <footer className="chat-input">
                <input type="text" placeholder="Сообщение..." />
                <button>➤</button>
                
            </footer>

        </section>
    );
}