import './Chat.css'
import '../../styles/variables.css'

const Chat1 = () => {
    return (
        <>
            <section className="screen card chats" data-screen="chat">

                <div className="header">
                    <span>Казачий круг</span>
                </div>

                <div className="dialogs">
                <aside className="sidebar-nav">
                    <div className="nav-top">
                    <button className="nav-icon active" data-mode="chats">💬</button>
                    <button className="nav-icon" data-mode="groups">👥</button>
                    <button className="nav-icon" data-mode="calls">📞</button>
                    </div>
                    <div className="nav-bottom">
                    <button className="nav-icon">?</button>
                    <button className="nav-icon" data-go="settings">⚙</button>
                    </div>
                </aside>

                <section className="sidebar-list">

                    <div className="list-actions">
                    <button className="list-action">Новый чат</button>
                    <button className="list-action">Создать группу</button>
                    </div>

                    <div className="chat-list">

                    <div className="chat-item active" data-type="chat">
                        <div className="chat-title">Атаман</div>
                    </div>

                    <div className="chat-item" data-type="group">
                        <div className="chat-title">Круг</div>
                    </div>

                    </div>

                </section>

                <main className="chat-main">

                    <header className="chat-header">
                    <h2 className="title">Атаман</h2>
                    <div className="chat-actions">
                        <span>личный чат</span>
                        <div className="chat-settings">
                        <button>📞</button>
                        <button>⋯</button>
                        </div>
                    </div>
                    </header>

                    <div className="chat-messages">
                    <div className="message incoming">
                        <div className="bubble">Собрание сегодня в 20:00</div>
                    </div>

                    <div className="message outgoing">
                        <div className="bubble">Принял</div>
                        <span className="message-status sent">✓</span>

                        <span className="message-status delivered">✓✓</span>

                        <span className="message-status read">✓✓</span>
                    </div>
                    </div>

                    <footer className="chat-input">
                    <input type="text" placeholder="Сообщение..." />
                    <button className="send">➤</button>
                    </footer>

                </main>
                </div>
            </section>
        </>
    )
}

export default Chat1