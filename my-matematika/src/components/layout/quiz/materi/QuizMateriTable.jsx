// src/components/layout/quiz/QuizMateriTable.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../lib/firebaseConfig";
import { Check, Trash2, Eye, Pencil } from "lucide-react";
import ConfirmModal from "../../../ui/ConfirmModal";
import { toast } from "../../../../hooks/use-toast";
import { Button } from "../../../ui/button";
import QuizMateriDetailModal from "../../../ui/quiz/materi/QuizMateriDetailModal";
import QuizMateriEditModal from "../../../ui/quiz/materi/QuizMateriEditModal";
import ChangeStatusModal from "../../../ui/quiz/materi/ChangeStatusMateriModal";

export default function QuizMateriTable(externalRefresh ) {
    const [quizList, setQuizList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [selectedMateri, setSelectedMateri] = useState(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    const fetchQuiz = async () => {
        setLoading(true);
        try {
            const quizRef = collection(db, "quiz_materi");
            const snapshot = await getDocs(quizRef);
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
        }));
            setQuizList(data);
        } catch (error) {
            console.error("🔥 Gagal ambil data quiz:", error);
            toast({ title: "Gagal memuat data quiz", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuiz();
    }, []);

    useEffect(() => {
        if (externalRefresh) fetchQuiz();
    }, [externalRefresh]);

    const handleOpenConfirm = (quiz) => {
        setSelectedMateri(quiz);
        setOpenConfirmModal(true);
    };

    const handleOpenDetail = (quiz) => {
        setSelectedMateri(quiz);
        setOpenDetailModal(true);
    };

    const handleOpenEdit = (quiz) => {
        setSelectedQuiz(quiz);
        setOpenEditModal(true);
    };
    
    const handleChangeStatus = (quiz) => {
        setSelectedQuiz(quiz);
        setIsStatusModalOpen(true);
    };

    const handleQuizUpdated = (updatedQuiz) => {
        setQuizList((prev) =>
            prev.map((quiz) =>
                quiz.id === updatedQuiz.id ? { ...quiz, ...updatedQuiz } : quiz
            )
        );
    };    

    const handleSaveStatus = async (newStatus) => {
        const quizRef = doc(db, "quiz", selectedQuiz.id);
        await updateDoc(quizRef, { status: newStatus });
        toast.success(`Status berhasil diubah menjadi ${newStatus}`);
    }

    const handleConfirmDelete = async () => {
        console.log("🧹 Menghapus materi:", selectedMateri); // 🔍 Tambah log
    
        try {
        const res = await fetch("/api/quiz_materi", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedMateri.id }),
        });
    
        console.log("📡 Status:", res.status); // 🔍 Tambah log
        const result = await res.json();
        console.log("📦 Response:", result); // 🔍 Tambah log
    
        if (result.success) {
            setQuizList((prev) => prev.filter((item) => item.id !== selectedMateri.id));
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

    if (loading) {
        return (
            <div className="p-6 text-center text-slate-500 animate-pulse">
                Memuat data quiz materi...
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-8 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Daftar Quiz Materi</h3>
                <div className="text-sm text-slate-500">
                    Total: {quizList.length} quiz
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase text-xs tracking-wide">
                        <tr>
                            <th className="py-3 px-5 font-semibold">Judul Quiz</th>
                            <th className="py-3 px-5 font-semibold">Deskripsi</th>
                            <th className="py-3 px-5 font-semibold">Kelas</th>
                            <th className="py-3 px-5 font-semibold">Jenis Materi</th>
                            <th className="py-3 px-5 font-semibold text-center">Jumlah Soal</th>
                            <th className="py-3 px-5 font-semibold text-center">Status</th>
                            <th className="py-3 px-5 font-semibold text-center">Tanggal Dibuat</th>
                            <th className="py-3 px-5 font-semibold text-center">Tanggal Diupdate</th>
                            <th className="py-3 px-5 font-semibold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizList.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-slate-400 italic">
                                    Belum ada quiz yang ditambahkan.
                                </td>
                            </tr>
                        ) : (
                            quizList.map((quiz) => (
                                <tr
                                    key={quiz.id}
                                    className="hover:bg-blue-50/40 transition-all border-b border-slate-100"
                                >
                                    <td className="px-5 py-3 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-700">
                                            {quiz.title ? quiz.title[0].toUpperCase() : "?"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{quiz.title || "-"}</p>
                                            <p className="text-xs text-slate-400">#{quiz.id}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-5 text-slate-700">
                                        {quiz.description || "-"}
                                    </td>
                                    <td className="py-3 px-5 text-slate-700">
                                        {quiz.class || "-"}
                                    </td>
                                    <td className="py-3 px-5 text-slate-700">
                                        {quiz.materi || "-"}
                                    </td>
                                    <td className="py-3 px-5 text-center text-slate-700">
                                        {quiz.questions?.length || 0}
                                    </td>
                                    <td className="py-3 px-5 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                quiz.status === "published"
                                                    ? "bg-green-200 text-green-700 border border-green-300 w-12"
                                                    : "bg-slate-300 text-slate-700 border border-slate-300 w-12"
                                            }`}
                                        >
                                            {quiz.status === "published" ? "Publik" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-5 text-center text-emerald-700 whitespace-nowrap">
                                        {quiz.created_at
                                            ? new Date(
                                                    quiz.created_at.seconds * 1000
                                                ).toLocaleString("id-ID")
                                            : "-"}
                                    </td>
                                    <td className="py-3 px-5 text-center text-amber-700 whitespace-nowrap">
                                        {quiz.updated_at
                                            ? new Date(
                                                    quiz.updated_at.seconds * 1000
                                                ).toLocaleString("id-ID")
                                            : "-"}
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded-lg"
                                                onClick={() => handleChangeStatus(quiz)}
                                                >
                                                <Check size={18} />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg"
                                                onClick={() => handleOpenDetail(quiz)}
                                                >
                                                <Eye size={18} />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded-lg"
                                                onClick={() => handleOpenEdit(quiz)}
                                                >
                                                <Pencil size={18} />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg"
                                                onClick={() => handleOpenConfirm(quiz)}
                                                >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        <ConfirmModal
                            isOpen={openConfirmModal}
                            onClose={() => setOpenConfirmModal(false)}
                            onConfirm={handleConfirmDelete}
                            title="Konfirmasi Hapus"
                            message={`Apakah kamu yakin ingin menghapus quiz`}
                            main={`"${selectedMateri?.title}"`}
                        />
                        <QuizMateriDetailModal
                            isOpen={openDetailModal}
                            onClose={() => setOpenDetailModal(false)}
                            quiz={selectedMateri}
                        />
                        <QuizMateriEditModal
                        isOpen={openEditModal}
                        onClose={() => setOpenEditModal(false)}
                        quiz={selectedQuiz}
                        onUpdated={handleQuizUpdated}
                        />
                        <ChangeStatusModal
                            isOpen={isStatusModalOpen}
                            onClose={() => setIsStatusModalOpen(false)}
                            quiz={selectedQuiz}
                            onSave={handleSaveStatus}
                        />
                    </tbody>
                </table>
            </div>
        </div>

    );
}
