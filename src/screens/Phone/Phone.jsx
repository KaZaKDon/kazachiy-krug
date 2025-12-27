import './Phone.css'
import '../../styles/variables.css'
import img from './icon.jpg';
import { useNavigate } from "react-router-dom";

export default function Phone() {
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/code");
    };

    return (
        <section className="auth-card">
            <div className="first">
                <img className="auth-logo" src={img} alt="logo" />

                <h1 className="auth-title">Вход по номеру телефона</h1>
                <p className="auth-description">
                    Мы отправим SMS с кодом подтверждения
                </p>

                <div className="auth-field">
                    <label>Номер телефона</label>
                    <input type="tel" placeholder="+7 ___ ___ __ __" />
                </div>

                <button className="auth-button" onClick={handleSubmit}>
                    Получить код
                </button>
            </div>
        </section>
    );
}