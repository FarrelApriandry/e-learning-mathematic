import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { Eye, Search } from "lucide-react";
import MateriAddModal from "./MateriAddModal.jsx";

export default function MateriTableFull() {
    const [materiList, setMateriList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [openAddModal, setOpenAddModal] = useState(false);

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
            console.error("Gagal memuat data materi:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchMateri();
    }, []);

    const filteredMateri = materiList.filter((item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 animate-fadeIn p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
            <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-slate-800">Daftar Materi</h2>
            <p className="text-slate-500 text-sm mt-1">
                Total {materiList.length} materi terdaftar
            </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                <input
                type="text"
                placeholder="Cari berdasarkan judul..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm w-full"
                />
            </div>
            <button
                onClick={() => setOpenAddModal(true)}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all w-full sm:w-auto"
            >
                + Tambah Materi
            </button>
            </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 text-left">
            <thead>
                <tr className="text-slate-500 text-xs uppercase">
                <th className="px-4 py-2">Judul</th>
                <th className="px-4 py-2">Kelas</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2">Link Video</th>
                <th className="px-4 py-2">Link PDF</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2">Update</th>
                <th className="px-4 py-2 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-400 animate-pulse">
                    Memuat data materi...
                    </td>
                </tr>
                ) : filteredMateri.length === 0 ? (
                <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-400 italic">
                    Tidak ada materi yang cocok dengan pencarian.
                    </td>
                </tr>
                ) : (
                filteredMateri.map((materi) => (
                    <tr
                    key={materi.id}
                    className="bg-slate-50 hover:bg-slate-100 transition-all duration-150 rounded-xl shadow-sm"
                    >
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                            {materi.materi ? materi.materi[0].toUpperCase() : "?"}
                        </div>
                        <div>
                            <p className="font-medium text-slate-800">{materi.title || "-"}</p>
                            <div className="flex gap-1">
                            <p className="text-xs text-slate-500">#{materi.id}</p>
                            <p className="text-xs text-slate-500">(ID Materi)</p>
                            </div>
                        </div>
                        </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{materi.class || "-"}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                        {materi.description || "-"}
                    </td>
                    <td className="px-4 py-3 text-blue-600">
                        {materi.youtube_link ? (
                        <a
                            href={materi.youtube_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            YouTube
                        </a>
                        ) : (
                        "-"
                        )}
                    </td>
                    <td className="px-4 py-3 text-blue-600">
                        {materi.pdf_link ? (
                        <a
                            href={materi.pdf_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            PDF
                        </a>
                        ) : (
                        "-"
                        )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                        {materi.created_at
                        ? new Date(materi.created_at.seconds * 1000).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            })
                        : "-"}
                    </td>

                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                        {materi.updated_at
                        ? new Date(materi.updated_at.seconds * 1000).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            })
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                        <button className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all">
                        <Eye size={16} />
                        View
                        </button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>

        {/* Card View - Mobile */}
        <div className="grid md:hidden gap-4">
            {loading ? (
            <p className="text-center text-slate-400 py-6 animate-pulse">Memuat data materi...</p>
            ) : filteredMateri.length === 0 ? (
            <p className="text-center text-slate-400 italic py-6">
                Tidak ada materi yang cocok dengan pencarian.
            </p>
            ) : (
            filteredMateri.map((materi) => (
                <div
                key={materi.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm"
                >
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                    {materi.materi ? materi.materi[0].toUpperCase() : "?"}
                    </div>
                    <div>
                    <p className="font-semibold text-slate-800">{materi.title}</p>
                    <p className="text-xs text-slate-500">Kelas: {materi.class}</p>
                    </div>
                </div>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{materi.description}</p>
                <div className="flex flex-wrap gap-2 justify-between items-center">
                    {materi.youtube_link && (
                    <a
                        href={materi.youtube_link}
                        target="_blank"
                        className="text-blue-600 text-sm hover:underline"
                    >
                        🎥 Video
                    </a>
                    )}
                    {materi.pdf_link && (
                    <a
                        href={materi.pdf_link}
                        target="_blank"
                        className="text-blue-600 text-sm hover:underline"
                    >
                        📘 PDF
                    </a>
                    )}
                    <button className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all ml-auto">
                    <Eye size={14} />
                    View
                    </button>
                </div>
                </div>
            ))
            )}
        </div>

        <MateriAddModal open={openAddModal} setOpen={setOpenAddModal} />
        </div>
    );
}
