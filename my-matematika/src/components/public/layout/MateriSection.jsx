import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";

export default function MateriSection() {
    const [materi, setMateri] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMateri = async () => {
            try {
                const ref = collection(db, "materi");
                const snapshot = await getDocs(ref);
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setMateri(data);
            } catch (err) {
                console.error("Gagal memuat data materi:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMateri();
    }, []);

    if (loading) return <p className="text-center text-slate-500 mt-8">Memuat materi...</p>;

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Pilih Kelas</h2>
                <a href="/materi/" className="text-sm text-slate-500 hover:text-slate-800">
                Lihat Semua →
                </a>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {materi.map((item) => (
                <a
                    key={item.id}
                    href={item.youtube_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card p-6 flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition"
                >
                    <div>
                    <div className="text-sm rounded bg-slate-100 text-amber-400">Kelas {item.class || "Kelas"}</div>
                    <div className="mt-2 text-lg font-semibold">{item.title}</div>
                    <p className="text-sm text-slate-600 mt-2">
                        {item.description || "Materi pembelajaran interaktif"}
                    </p>
                    </div>
                    <div className="mt-4 self-end">
                    <span className="text-xs text-indigo-500">
                        {item.youtube_link ? "Klik untuk belajar" : "Tidak ada video"}
                    </span>
                    </div>
                </a>
                ))}
            </div>
        </section>
    );
}
