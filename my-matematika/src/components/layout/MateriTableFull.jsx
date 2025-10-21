// src/components/layout/MateriTableFull.jsx
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { Eye, Trash2, Search, Pencil } from "lucide-react";
import MateriAddModal from "../ui/materi/MateriFormModal.jsx";
import MateriDetailModal from "../ui/materi/MateriDetailModal.jsx";
import ConfirmModal from "../ui/ConfirmModal.jsx";
import MateriEditModal from "../ui/materi/MateriEditModal.jsx"

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
    const [openEditModal, setOpenEditModal] = useState(false);

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

    const handleOpenEdit = (materi) => {
        setSelectedMateri(materi);
        setOpenEditModal(true);
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
        <Card className="animate-fadeIn border border-slate-200 shadow-sm rounded-2xl bg-white">
            <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                <CardTitle className="text-xl font-semibold text-slate-800 tracking-tight">
                    Daftar Materi
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                    Total <span className="font-medium text-slate-700">{materiList.length}</span> materi terdaftar
                </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    <Input
                    placeholder="Cari judul materi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <Button
                    onClick={() => setOpenAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
                >
                    + Tambah Materi
                </Button>
                </div>
            </CardHeader>

            <CardContent className="overflow-x-auto mt-4">
                {/* Table Desktop */}
                <div className="hidden md:block">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                    <tr className="text-slate-500 text-xs uppercase tracking-wider bg-slate-50 border-y border-slate-100">
                        <th className="px-5 py-3 font-semibold">Judul</th>
                        <th className="px-5 py-3 font-semibold">Kelas</th>
                        <th className="px-5 py-3 font-semibold">Deskripsi</th>
                        <th className="px-5 py-3 font-semibold">Video</th>
                        <th className="px-5 py-3 font-semibold">PDF</th>
                        <th className="px-5 py-3 font-semibold">Dibuat</th>
                        <th className="px-5 py-3 font-semibold">Update</th>
                        <th className="px-5 py-3 text-center font-semibold">Aksi</th>
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
                            Tidak ada hasil pencarian.
                        </td>
                        </tr>
                    ) : (
                        filteredMateri.map((m) => (
                        <tr
                            key={m.id}
                            className="group transition-all hover:bg-blue-50/40 border-b border-slate-100"
                        >
                            <td className="px-5 py-3 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-700">
                                    {m.materi ? m.materi[0].toUpperCase() : "?"}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">{m.title || "-"}</p>
                                    <p className="text-xs text-slate-400">#{m.id}</p>
                                </div>
                            </td>
                            <td className="px-5 py-3 text-slate-700">{m.class || "-"}</td>
                            <td className="px-5 py-3 text-slate-600 max-w-xs truncate">{m.description || "-"}</td>
                            <td className="px-5 py-3">
                            {m.youtube_link ? (
                                <a
                                href={m.youtube_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                                >
                                YouTube
                                </a>
                            ) : (
                                <span className="text-slate-400">-</span>
                            )}
                            </td>
                            <td className="px-5 py-3">
                            {m.pdf_link ? (
                                <a
                                href={m.pdf_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline text-sm"
                                >
                                PDF
                                </a>
                            ) : (
                                <span className="text-slate-400">-</span>
                            )}
                            </td>
                            <td className="px-5 py-3 text-xs text-slate-600 whitespace-nowrap">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                                    {m.created_at
                                    ? new Date(m.created_at.seconds * 1000).toLocaleString("id-ID")
                                    : "-"}
                                </span>
                            </td>
                            <td className="px-5 py-3 text-xs text-slate-600 whitespace-nowrap">
                                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full font-medium">
                                    {m.updated_at
                                    ? new Date(m.updated_at.seconds * 1000).toLocaleString("id-ID")
                                    : "-"}
                                </span>
                            </td>
                            <td className="px-5 py-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg"
                                        onClick={() => handleOpenDetail(m)}
                                        >
                                        <Eye size={18} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded-lg"
                                        onClick={() => handleOpenEdit(m)}
                                        >
                                        <Pencil size={18} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg"
                                        onClick={() => handleOpenConfirm(m)}
                                        >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
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
                    <p className="text-center text-slate-400 py-6 animate-pulse">
                    Memuat data materi...
                    </p>
                ) : filteredMateri.length === 0 ? (
                    <p className="text-center text-slate-400 italic py-6">
                    Tidak ada materi yang cocok.
                    </p>
                ) : (
                    filteredMateri.map((m) => (
                    <Card key={m.id} className="border border-slate-200 shadow-sm rounded-xl">
                        <CardContent className="p-4">
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
                        <div className="flex flex-wrap gap-3 justify-between items-center">
                            {m.youtube_link && (
                            <a
                                href={m.youtube_link}
                                target="_blank"
                                className="text-blue-600 text-sm hover:underline"
                            >
                                Video
                            </a>
                            )}
                            {m.pdf_link && (
                            <a
                                href={m.pdf_link}
                                target="_blank"
                                className="text-indigo-600 text-sm hover:underline"
                            >
                                PDF
                            </a>
                            )}
                            <div className="ml-auto flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg"
                                onClick={() => handleOpenDetail(m)}
                            >
                                <Eye size={16} />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg"
                                onClick={() => handleOpenConfirm(m)}
                            >
                                <Trash2 size={16} />
                            </Button>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                    ))
                )}
                </div>

                <MateriEditModal
                isOpen={openEditModal}
                onClose={() => setOpenEditModal(false)}
                materi={selectedMateri}
                onSave={() => window.location.reload()} // atau update state kalau mau smooth
                />

                {/* Modals */}
                <MateriDetailModal
                isOpen={openDetailModal}
                onClose={() => setOpenDetailModal(false)}
                materi={selectedMateri}
                />

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
