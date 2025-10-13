// src/pages/admin/Login.jsx
import { auth, onAuthStateChanged } from "../../lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "preact/hooks";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
        if (user) window.location.href = "/admin/dashboard";
        });
        return () => unsub();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        await signInWithEmailAndPassword(auth, email, password);
        } catch {
        setError("Email atau password salah.");
        }
    };

    return (
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
            <h1 class="text-2xl font-bold text-center mb-6">Admin Login</h1>
            <form onSubmit={handleLogin} class="space-y-4">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onInput={(e) => setEmail(e.target.value)}
                class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onInput={(e) => setPassword(e.target.value)}
                class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p class="text-red-500 text-sm">{error}</p>}
            <button
                type="submit"
                class="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition"
            >
                Masuk
            </button>
            </form>
        </div>
        </div>
    );
};

export default Login;
