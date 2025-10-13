// src/pages/admin/Login.jsx
import { auth, onAuthStateChanged } from "../../lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import AuthCard from "../ui/AuthCard";
import AlertToast from "../ui/AlertToast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState(null); // {type, message}

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            // Cegah redirect terlalu cepat: biarin toast tampil dulu
            if (user && !window._redirecting) {
                window._redirecting = true;
                setTimeout(() => {
                    window.location.href = "/admin/dashboard/dashboard";
                }, 1600); // delay 1.6 detik agar toast muncul
            }
        });
        return () => unsub();
    }, []);
    const handleLogin = async (e) => {
        e.preventDefault();
            try {
                await signInWithEmailAndPassword(auth, email, password);
                setAlert({ type: "success", message: "Login berhasil! Mengalihkan..." });
            } catch (err) {
                setAlert({ type: "error", message: "Email atau password salah." });
            }
        // Auto-hide alert setelah 3.5 detik
        setTimeout(() => setAlert(null), 3500);
    };

    return (
        <div class="min-h-screen flex items-center justify-center bg-[var(--bg)] px-6">
        <div class="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl gap-8">
            {/* LEFT: FORM */}
            <AuthCard>
            <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">A+</div>
                <div>
                <h1 class="text-xl font-bold">Asyik Math Admin</h1>
                <p class="text-sm text-slate-500">Panel pengelolaan konten</p>
                </div>
            </div>

            <form onSubmit={handleLogin} class="space-y-4">
                <input
                type="email"
                placeholder="Email"
                value={email}
                onInput={(e) => setEmail(e.target.value)}
                class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                onInput={(e) => setPassword(e.target.value)}
                class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
                <button type="submit" class="btn-primary w-full">Masuk</button>
            </form>

            <p class="text-center text-xs text-slate-400 mt-6">© 2025 Asyik Math E-Learning</p>
            </AuthCard>

            {/* RIGHT: ILLUSTRATION */}
            <div class="hidden md:flex flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-8">
            <img src="/public/illustrations/adm-login_illustration.svg" alt="Login Illustration" class="w-3/4 max-w-lg animate-slide-in-left" />
            </div>
        </div>

        {/* ALERT */}
        {alert && <AlertToast type={alert.type} message={alert.message} />}
        </div>
    );
};

export default Login;
