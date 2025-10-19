// src/components/layout/quiz/event/QuizEventTable.jsx
import { useEffect, useState } from "react";
import { Check, Trash2, Eye, Pencil } from "lucide-react";
import ConfirmModal from "../../../ui/ConfirmModal";
import { Button } from "../../../ui/button";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
// import QuizEventDetailModal from "../../../ui/quiz/event/QuizEventDetailModal";
// import QuizEventEditModal from "../../../ui/quiz/event/QuizEventEditModal";
// import ChangeStatusModal from "../../../ui/quiz/event/ChangeStatusModal";
import { toast } from "../../../../hooks/use-toast";
import { db } from "../../../../lib/firebaseConfig";

export default function QuizEventTable() {
    const [quizList, setQuizList] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const quizRef = collection(db, "quiz_event");
                const snapshot = await getDocs(quizRef);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setQuizList(data);
            } catch (error) {
                console.error("🔥 Gagal ambil data quiz global:", error);
                toast({ title: "Gagal memuat data quiz", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, []);

    // useEffect(() => {
    //     fetchEvents();
    // }, []);

    // const handleOpenConfirm = (event) => {
    //     setSelectedEvent(event);
    //     setOpenConfirmModal(true);
    // };

    // const handleOpenDetail = (event) => {
    //     setSelectedEvent(event);
    //     setOpenDetailModal(true);
    // };

    // const handleOpenEdit = (event) => {
    //     setSelectedEvent(event);
    //     setOpenEditModal(true);
    // };

    // const handleChangeStatus = (event) => {
    //     setSelectedEvent(event);
    //     setIsStatusModalOpen(true);
    // };

    // const handleEventUpdated = (updatedEvent) => {
    //     setEvents((prev) =>
    //     prev.map((e) => (e.id === updatedEvent.id ? { ...e, ...updatedEvent } : e))
    //     );
    // };

    // const handleConfirmDelete = async () => {
    //     try {
    //     await fetch("/api/quiz_event", {
    //         method: "DELETE",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ id: selectedEvent.id }),
    //     });
    //     setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
    //     toast({ title: `Event "${selectedEvent.title}" berhasil dihapus!` });
    //     } catch (err) {
    //     console.error(err);
    //     toast({ title: "Gagal menghapus event", variant: "destructive" });
    //     } finally {
    //     setOpenConfirmModal(false);
    //     setSelectedEvent(null);
    //     }
    // };

    // const handleSaveStatus = async (newStatus) => {
    //     try {
    //     await fetch("/api/quiz_event", {
    //         method: "PUT",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ id: selectedEvent.id, updates: { status: newStatus } }),
    //     });
    //     handleEventUpdated({ ...selectedEvent, status: newStatus });
    //     toast({ title: `Status berhasil diubah menjadi ${newStatus}` });
    //     } catch (err) {
    //     console.error(err);
    //     toast({ title: "Gagal mengubah status", variant: "destructive" });
    //     } finally {
    //         setIsStatusModalOpen(false);
    //     }
    // };

    if (loading) return <div className="p-6 text-center text-slate-500 animate-pulse">Memuat data event...</div>;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-8 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Daftar Event Quiz</h3>
            <div className="text-sm text-slate-500">Total: {events.length} event</div>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase text-xs tracking-wide">
                <tr>
                <th className="py-3 px-5 font-semibold">Judul Event</th>
                <th className="py-3 px-5 font-semibold">Deskripsi</th>
                <th className="py-3 px-5 font-semibold text-center">Jumlah Soal</th>
                <th className="py-3 px-5 font-semibold text-center">Durasi</th>
                <th className="py-3 px-5 font-semibold text-center">Status</th>
                <th className="py-3 px-5 font-semibold text-center">Tanggal Dibuat</th>
                <th className="py-3 px-5 font-semibold text-center">Tanggal Diupdate</th>
                <th className="py-3 px-5 font-semibold text-center">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {quizList.length === 0 ? (
                <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-400 italic">
                    Belum ada event quiz yang ditambahkan.
                    </td>
                </tr>
                ) : (
                quizList.map((quiz) => (
                    <tr key={quiz.id} className="hover:bg-blue-50/40 transition-all border-b border-slate-100">
                        <td className="px-5 py-3 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-700">
                                {quiz.title ? quiz.title[0].toUpperCase() : "?"}
                            </div>
                            <div>
                                <p className="font-medium text-slate-800">{quiz.title || "-"}</p>
                                <p className="text-xs text-slate-400">#{quiz.id}</p>
                            </div>
                        </td>
                        <td className="py-3 px-5 text-slate-700">{quiz.description || "-"}</td>
                        <td className="py-3 px-5 text-center text-slate-700">{quiz.questions?.length || 0}</td>
                        <td className="py-3 px-5 text-center text-slate-700">{quiz.duration_minutes || 0} menit</td>
                        <td className="px-5 py-3 text-center">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    quiz.status === "published"
                                    ? "bg-green-200 text-green-700 border border-green-300 w-12"
                                    : quiz.status === "closed"
                                    ? "bg-red-200 text-red-700 border border-red-300 w-12"
                                    : quiz.status === "started"
                                    ? "bg-slate-300 text-slate-700 border border-slate-300 w-12"
                                    : quiz.status === "ongoing"
                                    ? "bg-slate-300 text-slate-700 border border-slate-300 w-12"
                                    : "bg-slate-300 text-slate-700 border border-slate-300 w-12"
                                }`}>
                                {quiz.status === "published"
                                ? "Publik"
                                : quiz.status === "closed"
                                ? "Ditutup"
                                : quiz.status === "started"
                                ? "Dimulai"
                                : quiz.status === "ongoing"
                                ? "Sedang Berlangsung"
                                : "Draft"}
                            </span>
                        </td>
                        <td className="py-3 px-5 text-center text-emerald-700 whitespace-nowrap">
                            {quiz.created_at
                            ? new Date(quiz.created_at.seconds * 1000).toLocaleString("id-ID")
                            : "-"}
                        </td>
                        <td className="py-3 px-5 text-center text-amber-700 whitespace-nowrap">
                            {quiz.updated_at
                            ? new Date(quiz.updated_at.seconds * 1000).toLocaleString("id-ID")
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
            </tbody>
            </table>
        </div>

        {/* <ConfirmModal
            isOpen={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
            onConfirm={handleConfirmDelete}
            title="Konfirmasi Hapus"
            message={`Apakah kamu yakin ingin menghapus event "${selectedEvent?.title}"?`}
        />
        <QuizEventDetailModal
            isOpen={openDetailModal}
            onClose={() => setOpenDetailModal(false)}
            event={selectedEvent}
        />
        <QuizEventEditModal
            isOpen={openEditModal}
            onClose={() => setOpenEditModal(false)}
            event={selectedEvent}
            onUpdate={handleEventUpdated}
        />
        <ChangeStatusModal
            isOpen={isStatusModalOpen}
            onClose={() => setIsStatusModalOpen(false)}
            event={selectedEvent}
            onSave={handleSaveStatus} 
        /> */}
        </div>
    );
    }
