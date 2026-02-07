import { Routes, Route, Navigate } from "react-router-dom";
<<<<<<< HEAD

import Phone from "../screens/Phone/Phone";
import Code from "../screens/Auth/Code";
import Chat from "../screens/Chat/Chat";
import Settings from "../screens/Settings/Settings";
import Profile from "../screens/Profile/Profile";

export default function AppRouter({ currentUser, setCurrentUser }) {
    const isAuth = Boolean(currentUser?.id);
    const hasPhone = (() => {
        try {
            return Boolean(localStorage.getItem("phone"));
        } catch {
            return false;
        }
    })();


    return (
        <Routes>
            {/* авторизация */}
            <Route
                path="/"
                element={<Navigate to={isAuth ? "/chat" : "/phone"} replace />}
            />
            <Route
                path="/phone"
                element={isAuth ? <Navigate to="/chat" replace /> : <Phone />}
            />


            <Route
                path="/code"
                element={
                    isAuth
                        ? <Navigate to="/chat" replace />
                        : hasPhone
                            ? <Code setCurrentUser={setCurrentUser} />
                            : <Navigate to="/phone" replace />
                }


            />


            {/* защищенные маршруты */}
            <Route
                path="/chat"
                element={
                    isAuth
                        ? <Chat currentUser={currentUser} />
                        : <Navigate to="/phone" replace />
                }
            />

            <Route
                path="/settings"
                element={
                    isAuth
=======

import Phone from "../screens/Phone/Phone";
import Code from "../screens/Auth/Code";
import Chat from "../screens/Chat/Chat";
import Settings from "../screens/Settings/Settings";
import Profile from "../screens/Profile/Profile";

export default function AppRouter({ currentUser, setCurrentUser }) {
    return (
        <Routes>
            {/* авторизация */}
            <Route path="/" element={<Navigate to="/phone" replace />} />
            <Route path="/phone" element={<Phone />} />
            <Route
                path="/code"
                element={<Code setCurrentUser={setCurrentUser} />}
            />

            {/* защищенные маршруты */}
            <Route
                path="/chat"
                element={
                    currentUser
                        ? <Chat currentUser={currentUser} />
                        : <Navigate to="/phone" replace />
                }
            />

            <Route
                path="/settings"
                element={
                    currentUser
>>>>>>> e776f2ce9223cc25dc5562c1969385dcc0b6c9dd
                        ? <Settings currentUser={currentUser} />
                        : <Navigate to="/phone" replace />
                }
            />

            <Route
                path="/profile"
                element={
<<<<<<< HEAD
                    isAuth
=======
                    currentUser
>>>>>>> e776f2ce9223cc25dc5562c1969385dcc0b6c9dd
                        ? <Profile currentUser={currentUser} />
                        : <Navigate to="/phone" replace />
                }
            />

            {/* fallback */}
<<<<<<< HEAD
            <Route
                path="*"
                element={<Navigate to={isAuth ? "/chat" : "/phone"} replace />}
            />
=======
            <Route path="*" element={<Navigate to="/phone" replace />} />
>>>>>>> e776f2ce9223cc25dc5562c1969385dcc0b6c9dd
        </Routes>
    );
}