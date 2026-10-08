// src/pages/admin/Login.jsx
import { fetchMe, loginAdmin } from "../../lib/authClient.js";
import { useState, useEffect } from "react";
import AuthCard from "../ui/AuthCard";
import AlertToast from "../ui/AlertToast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null); // {type, message}

    useEffect(() => {
        // Kalau sudah login, langsung ke dashboard
        fetchMe().then((user) => {
            if (user && !window._redirecting) {
                window._redirecting = true;
                window.location.href = "/admin/dashboard/";
            }
        });
    }, []);
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        try {
            await loginAdmin(email, password);
            setAlert({ type: "success", message: "Login berhasil! Mengalihkan..." });
            setTimeout(() => {
                window.location.href = "/admin/dashboard/";
            }, 900);
        } catch (err) {
            setAlert({ type: "error", message: err.message || "Email atau password salah." });
            setLoading(false);
        }
        setTimeout(() => setAlert(null), 3500);
    };

    const year = new Date().getFullYear();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl gap-10">
            {/* LEFT: FORM */}
            <AuthCard>
            <div className="flex items-center gap-3 mb-6">
                <img src="/icon.svg" className="h-10 w-10" alt="Logo Asyik Math" width="40" height="40" />
                <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Asyik Math Admin</h1>
                <p className="text-sm text-slate-500">Panel pengelolaan konten</p>
                </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                    <input
                    id="admin-email"
                    type="email"
                    placeholder="admin@admin.id"
                    value={email}
                    onInput={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    autoComplete="username"
                    required
                    />
                </div>
                <div>
                    <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
                    <input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onInput={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    autoComplete="current-password"
                    required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Memeriksa..." : "Masuk"}
                </button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-6">© {year} Asyik Math E-Learning</p>
            </AuthCard>

            {/* RIGHT: ILLUSTRATION */}
            <div className="hidden md:flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8">
            <img src="/illustrations/adm-login_Illustration.svg" alt="Ilustrasi login admin" className="w-3/4 max-w-lg" />
            </div>
        </div>

        {/* ALERT */}
        {alert && <AlertToast type={alert.type} message={alert.message} />}
        </div>
    );
};

export default Login;
