import { useNavigate } from 'react-router-dom';
import './auth.css';
import '../../styles/variables.css'
import img from './logo-icon.jpg';

export default function Code() {
    const navigate = useNavigate();

    const handleConfirm = () => {
        navigate("/Chat");
    };

    return (
        <section className="auth-card">
            <div className="second">
                <img
                className="auth-logo"
                src={img}
                alt="logo"
                />

                <h1 className="auth-title">Введите код</h1>
                <p className="auth-description">
                    Код отправлен на номер<br />+7 *** *** ** 45
                </p>

                <div className="code-inputs">
                    <input maxLength="1" />
                    <input maxLength="1" />
                    <input maxLength="1" />
                    <input maxLength="1" />
                </div>

                <button className="auth-button" onClick={handleConfirm}>
                    Подтвердить
                </button>

                <div className="auth-timer">
                    Отправить код повторно через 00:30
                </div>
            </div>
        </section>
    );
}