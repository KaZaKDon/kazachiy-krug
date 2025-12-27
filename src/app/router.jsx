import { Routes, Route, Navigate } from 'react-router-dom';

import Phone from '../screens/Phone/Phone';
import Code from '../screens/Auth/Code';
import Chat from '../screens/Chat/Chat';
import Settings from '../screens/Settings/Settings';
import Profile from '../screens/Profile/Profile';

export default function AppRouter() {
    return (
        <Routes>
            {/* авторизация */}
            <Route path="/" element={<Navigate to="/phone" replace />} />
            <Route path="/phone" element={<Phone />} />
            <Route path="/code" element={<Code />} />

            {/* основное приложение */}
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />

            {/* если путь не найден */}
            <Route path="*" element={<Navigate to="/phone" replace />} />
        </Routes>
    );
}