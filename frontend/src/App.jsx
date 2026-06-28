import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import WelcomePage from "./pages/WelcomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

import RegisterCard from "./components/RegisterCard.jsx";

import { useAuth } from "./context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    return !isAuthenticated ? children : <Navigate to="/chats" replace />;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<PublicRoute><WelcomePage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterCard /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/chats" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/error" element={<ErrorPage />} />
            <Route
                path="*"
                element={<Navigate to="/error" replace state={{ message: "Page Not Found", status: 404 }} />}
            />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AppRoutes />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="dark"
                pauseOnHover={false}
            />
        </Router>
    );
}

export default App;