import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

export default function MateriTable() {
    const [materiList, setMateriList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMateri = async () => {
        try {
            const materiRef = collection(db, "materi");
            const snapshot = await getDocs(materiRef);
            const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));
            setMateriList(data);
        } catch (error) {
            console.error("🔥 Gagal ambil data materi:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchMateri();
    }, []);

    if (loading) {
        return (
        <div className="p-6 text-center text-slate-500 animate-pulse">
            Memuat data materi...
        </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-md mt-8">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Daftar Materi</h3>
            <div className="text-sm text-slate-500">
            Total: {materiList.length} materi
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-slate-200 rounded-lg">
            <thead className="bg-slate-100 text-slate-600">
                <tr>
                <th className="py-3 px-4 border-b">Judul</th>
                <th className="py-3 px-4 border-b">Kelas</th>
                <th className="py-3 px-4 border-b">Deskripsi</th>
                <th className="py-3 px-4 border-b">Link YouTube</th>
                <th className="py-3 px-4 border-b">Link PDF</th>
                </tr>
            </thead>
            <tbody>
                {materiList.map((materi) => (
                <tr
                    key={materi.id}
                    className="hover:bg-slate-50 transition-colors"
                >
                    <td className="py-2 px-4 border-b font-medium">
                    {materi.title || "-"}
                    </td>
                    <td className="py-2 px-4 border-b">
                    {materi.class || "-"}
                    </td>
                    <td className="py-2 px-4 border-b">
                    {materi.description || "-"}
                    </td>
                    <td className="py-2 px-4 border-b">
                    {materi.youtube_link ? (
                        <a
                        href={materi.youtube_link}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        Buka Video
                        </a>
                    ) : (
                        "-"
                    )}
                    </td>
                    <td className="py-2 px-4 border-b">
                    {materi.pdf_link ? (
                        <a
                        href={materi.pdf_link}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        Buka PDF
                        </a>
                    ) : (
                        "-"
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
}
