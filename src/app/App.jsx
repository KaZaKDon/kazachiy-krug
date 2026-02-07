import { useState } from "react";
import AppRouter from "./router";

<<<<<<< HEAD

export default function App() {
    const [currentUser, setCurrentUser] = useState(null);
=======
function getInitialUser() {
    try {
        const raw = localStorage.getItem("currentUser");
        return raw ? JSON.parse(raw) : null;
    } catch {
        localStorage.removeItem("currentUser");
        return null;
    }
}

export default function App() {
    const [currentUser, setCurrentUser] = useState(getInitialUser);
>>>>>>> e776f2ce9223cc25dc5562c1969385dcc0b6c9dd

    return (
        <div className="app">
            <AppRouter
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
            />
        </div>
    );
}