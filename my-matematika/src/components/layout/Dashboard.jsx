// src/pages/admin/dashboard/Dashboard.jsx
import { auth, signOut } from "../../lib/firebaseConfig";

const Dashboard = () => {

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/admin";
        } catch (err) {
            console.error("Logout gagal:", err);
        }
    };

    const test = console.log("test");

    return (
        <div class="min-h-screen p-10 flex flex-col items-center justify-start bg-gray-50">
        <header class="w-full flex justify-between items-center mb-10">
            <h1 class="text-3xl font-bold">Dashboard Admin</h1>
            <button
            onClick={handleLogout}
            class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
            >
            Logout
            </button>
        </header>

        <section class="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-md">
            <p>Selamat datang di dashboard admin. Di sini kamu bisa mengelola materi dan quiz.</p>
        </section>
        </div>
    );
    };

export default Dashboard;
