    // src/components/layout/MateriTableFull.jsx
    "use client";
    
    import { useEffect, useState } from "react";
    import { collection, getDocs } from "firebase/firestore";
    import { db } from "../../lib/firebaseConfig";
    import { Eye, Trash2, Search } from "lucide-react";
    import MateriAddModal from "./MateriAddModal.jsx";
    import MateriDetailModal from "../ui/MateriDetailModal.jsx";
    import ConfirmModal from "../ui/ConfirmModal.jsx";

    // Shadcn UI imports
    import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
    import { Button } from "../ui/button";
    import { Input } from "../ui/input";
    import { toast } from "../../hooks/use-toast.js";

    export default function MateriTableFull() {
    const [materiList, setMateriList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [selectedMateri, setSelectedMateri] = useState(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);

    useEffect(() => {
        const fetchMateri = async () => {
        try {
            const snapshot = await getDocs(collection(db, "materi"));
            const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setMateriList(data);
        } catch (err) {
            console.error("Gagal memuat data materi:", err);
        } finally {
            setLoading(false);
        }
        };
        fetchMateri();
    }, []);

    const handleOpenConfirm = (materi) => {
        setSelectedMateri(materi);
        setOpenConfirmModal(true);
    };

    const handleOpenDetail = (materi) => {
        setSelectedMateri(materi);
        setOpenDetailModal(true);
    };

    const handleConfirmDelete = async () => {
        console.log("🧹 Menghapus materi:", selectedMateri); // 🔍 Tambah log
    
        try {
        const res = await fetch("/api/materi", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedMateri.id }),
        });
    
        console.log("📡 Status:", res.status); // 🔍 Tambah log
        const result = await res.json();
        console.log("📦 Response:", result); // 🔍 Tambah log
    
        if (result.success) {
            setMateriList((prev) => prev.filter((item) => item.id !== selectedMateri.id));
            toast({ title: `Materi "${selectedMateri.title}" berhasil dihapus!` });
        } else {
            toast({ title: `Gagal menghapus: ${result.message}`, variant: "destructive" });
        }
        } catch (err) {
        console.error("❌ Fetch error:", err);
        toast({ title: "Terjadi kesalahan saat menghapus materi.", variant: "destructive" });
        } finally {
        setOpenConfirmModal(false);
        setSelectedMateri(null);
        }
    };      

    const filteredMateri = materiList.filter((m) =>
        m.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card className="animate-fadeIn border border-slate-100">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
            <CardTitle className="text-xl">Daftar Materi</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Total {materiList.length} materi terdaftar</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                <Input
                placeholder="Cari berdasarkan judul..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                />
            </div>

            <Button onClick={() => setOpenAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
                + Tambah Materi
            </Button>
            </div>
        </CardHeader>

        <CardContent className="overflow-x-auto mt-4">
            {/* Table Desktop */}
            <div className="hidden md:block">
            <table className="min-w-full text-left border-separate border-spacing-y-3">
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
                ) : materiList.length === 0 ? (
                    <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-400 italic">
                        Belum ada materi yang ditambahkan.
                    </td>
                    </tr>
                ) : filteredMateri.length === 0 ? (
                    <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-400 italic">
                        Tidak ada materi yang cocok dengan pencarian.
                    </td>
                    </tr>
                ) : (
                    filteredMateri.map((m) => (
                    <tr key={m.id} className="bg-slate-50 hover:bg-slate-100 transition-all rounded-xl shadow-sm">
                        <td className="px-4 py-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                            {m.materi ? m.materi[0].toUpperCase() : "?"}
                        </div>
                        <div>
                            <p className="font-medium text-slate-800">{m.title || "-"}</p>
                            <p className="text-xs text-slate-500">#{m.id}</p>
                        </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{m.class || "-"}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{m.description || "-"}</td>
                        <td className="px-4 py-3 text-blue-600">
                        {m.youtube_link ? (
                            <a href={m.youtube_link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            YouTube
                            </a>
                        ) : "-"}
                        </td>
                        <td className="px-4 py-3 text-blue-600">
                        {m.pdf_link ? (
                            <a href={m.pdf_link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            PDF
                            </a>
                        ) : "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                        {m.created_at ? new Date(m.created_at.seconds * 1000).toLocaleString("id-ID") : "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                        {m.updated_at ? new Date(m.updated_at.seconds * 1000).toLocaleString("id-ID") : "-"}
                        </td>
                        <td className="px-4 py-3 text-center flex gap-1 justify-center">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDetail(m)}>
                            <Eye size={16} />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleOpenConfirm(m)}>
                            <Trash2 size={16} />
                        </Button>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>

            {/* Card Mobile */}
            <div className="grid md:hidden gap-4 mt-4">
            {loading ? (
                <p className="text-center text-slate-400 py-6 animate-pulse">Memuat data materi...</p>
            ) : filteredMateri.length === 0 ? (
                <p className="text-center text-slate-400 italic py-6">Tidak ada materi yang cocok dengan pencarian.</p>
            ) : (
                filteredMateri.map((m) => (
                <Card key={m.id}>
                    <CardContent>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                            {m.materi ? m.materi[0].toUpperCase() : "?"}
                            </div>
                            <div>
                            <p className="font-semibold text-slate-800">{m.title}</p>
                            <p className="text-xs text-slate-500">Kelas: {m.class}</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{m.description}</p>
                        <div className="flex flex-wrap gap-4 justify-between items-center">
                            {m.youtube_link && (
                            <a href={m.youtube_link} target="_blank" className="text-blue-600 text-sm hover:underline">
                                Video
                            </a>
                            )}
                            {m.pdf_link && (
                            <a href={m.pdf_link} target="_blank" className="text-blue-600 text-sm hover:underline">
                                PDF
                            </a>
                            )}
                            <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1" onClick={() => handleOpenDetail(m)}>
                                <Eye size={14} />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleOpenConfirm(m)}>
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                ))
            )}
            </div>

            <MateriDetailModal
                isOpen={openDetailModal}
                onClose={() => setOpenDetailModal(false)}
                materi={selectedMateri}
            />

            {/* Modals */}
            <MateriAddModal open={openAddModal} setOpen={setOpenAddModal} />
            <ConfirmModal
            isOpen={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
            onConfirm={handleConfirmDelete}
            title="Konfirmasi Hapus"
            message={`Apakah kamu yakin ingin menghapus materi "${selectedMateri?.title}"?`}
            />
        </CardContent>
        </Card>
    );
    }
