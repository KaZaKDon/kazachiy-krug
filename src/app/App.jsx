import {  useEffect,useState } from "react";
import AppRouter from "./router";

import { connectSocket } from "../shared/socket";


export default function App() {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const raw = localStorage.getItem("currentUser");
            return raw ? JSON.parse(raw) : null;
        } catch {
            sessionStorage.removeItem("currentUser");
            return null;
        }
    });

    useEffect(() => {
        try {
            if (currentUser?.id) {
                sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
            } else {
                sessionStorage.removeItem("currentUser");
            }
        } catch {
            // ignore storage errors
        }
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser?.id) return;
        const socket = connectSocket();
        socket.emit("auth:restore", {
            userId: currentUser.id,
            name: currentUser.name
        });
    }, [currentUser]);


    return (
        <div className="app">
            <AppRouter
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
            />
        </div>
    );
}