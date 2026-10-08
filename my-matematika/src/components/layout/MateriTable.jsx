// src/components/layout/MateriTable.jsx
// Ringkasan materi di dashboard (read-only, 5 terbaru)
import { useEffect, useState } from "react";
import { fetchMateri } from "../../lib/apiClient.js";

const KELAS_LABEL = { 10: "X", 11: "XI", 12: "XII" };

export default function MateriTable() {
    const [materiList, setMateriList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMateriData = async () => {
        try {
            const data = await fetchMateri();
            setMateriList(Array.isArray(data) ? data.slice(0, 5) : []);
        } catch (error) {
            console.error("Gagal ambil data materi:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchMateriData();
    }, []);

    return (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Materi Terbaru</h3>
            <a href="/admin/materi/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                Lihat semua
            </a>
        </div>

        {loading ? (
            <div className="space-y-2.5">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-11 animate-pulse rounded-lg bg-slate-100" />
                ))}
            </div>
        ) : materiList.length === 0 ? (
            <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                Belum ada materi. Tambah dari halaman Materi.
            </p>
        ) : (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
            <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="py-2.5 pr-4">Judul</th>
                <th className="py-2.5 pr-4">Kelas</th>
                <th className="py-2.5 pr-4">Konten</th>
                <th className="py-2.5">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {materiList.map((materi) => (
                <tr key={materi.id} className="hover:bg-slate-50">
                    <td className="py-2.5 pr-4 font-medium text-slate-900">
                    {materi.title || "-"}
                    </td>
                    <td className="py-2.5 pr-4">
                        <span className="inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">
                            {KELAS_LABEL[materi.class] ?? materi.class ?? "-"}
                        </span>
                    </td>
                    <td className="py-2.5 pr-4 text-slate-500">
                    {[
                        materi.youtube_link ? "Video" : null,
                        materi.pdf_link ? "PDF" : null,
                    ].filter(Boolean).join(" + ") || "Teks"}
                    </td>
                    <td className="py-2.5">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            materi.status === "published"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                        }`}>
                            {materi.status === "published" ? "Tayang" : "Draf"}
                        </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        )}
        </div>
    );
}
