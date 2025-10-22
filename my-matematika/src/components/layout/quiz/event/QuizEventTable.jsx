// src/components/layout/quiz/event/QuizEventTable.jsx
import { useEffect, useState } from "react";
import { Check, Trash2, Eye, Pencil } from "lucide-react";
import ConfirmModal from "../../../ui/ConfirmModal";
import { Button } from "../../../ui/button";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import QuizEventDetailModal from "../../../ui/quiz/event/QuizEventDetailModal";
import ChangeStatusEventModal from "../../../ui/quiz/event/ChangeStatusEventModal";
import QuizEventQuestionPage from "./QuizEventQuestionPage";
import QuizEventEditModal from "../../../ui/quiz/event/QuizEventEditModal";
import { toast } from "../../../../hooks/use-toast";
import { db } from "../../../../lib/firebaseConfig";

export default function QuizEventTable({ refreshTrigger, onQuestionPageToggle }) {
    const [eventList, setEventList] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [isQuestionPageOpen, setIsQuestionPageOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const quizRef = collection(db, "quiz_event");
                const snapshot = await getDocs(quizRef);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setEventList(data);
            } catch (error) {
                console.error("🔥 Gagal ambil data quiz global:", error);
                toast({ title: "Gagal memuat data quiz", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, []);

    const handleOpenConfirm = (event) => {
        setSelectedEvent(event);
        setOpenConfirmModal(true);
    };
    
    const handleOpenDetail = (event) => {
        setSelectedEvent(event);
        setIsDetailModalOpen(true);
    };    

    const handleOpenEdit = (event) => {
        setSelectedEvent(event);
        setOpenEditModal(true);
    };
    
    const handleChangeStatus = (event) => {
        setSelectedEvent(event);
        setIsStatusModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteDoc(doc(db, "quiz_event", selectedEvent.id));
            setEventList((prev) => prev.filter((item) => item.id !== selectedEvent.id));
            toast({ title: `Quiz "${selectedEvent.title}" berhasil dihapus!` });
        } catch (err) {
            console.error("❌ Gagal menghapus event:", err);
            toast({ title: "Gagal menghapus event", variant: "destructive" });
        } finally {
            setOpenConfirmModal(false);
            setSelectedEvent(null);
        }
    };

    const handleEventUpdated = (updatedEvent) => {
        setEvents((prev) =>
        prev.map((e) => (e.id === updatedEvent.id ? { ...e, ...updatedEvent } : e))
        );
    };

    
    const handleSaveStatus = async (newStatus) => {
        const quizRef = doc(db, "quiz_event", selectedEvent.id);
        await updateDoc(quizRef, { status: newStatus });
        
        setEventList(prev => 
            prev.map(e => e.id === selectedEvent.id ? { ...e, status: newStatus } : e)
        );
        
        toast({
            title: "Status berhasil diubah",
            description: `Status event diubah menjadi ${newStatus}`,
        });
    };
    

    const handleEventQuestion = (event) => {
        setSelectedEventId(event.id);
        setIsQuestionPageOpen(true);
        if (onQuestionPageToggle) onQuestionPageToggle(true);
    };

    if (loading) return <div className="p-6 text-center text-slate-500 animate-pulse">Memuat data event...</div>;

    return (
    <>
        {isQuestionPageOpen ? (
            <QuizEventQuestionPage
                eventId={selectedEventId}
                onBack={() => {
                    setIsQuestionPageOpen(false);
                    setSelectedEventId(null);
                    if (onQuestionPageToggle) onQuestionPageToggle(false);
                }}
            />
        ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-8 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Daftar Event Quiz</h3>
                <div className="text-sm text-slate-500">Total: {eventList.length} event</div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase text-xs tracking-wide">
                    <tr>
                        <th className="py-3 px-5 font-semibold">Judul Event</th>
                        <th className="py-3 px-5 font-semibold">Kode Event</th>
                        <th className="py-3 px-5 font-semibold">Deskripsi</th>
                        <th className="py-3 px-5 font-semibold text-center">Kelola Soal</th>
                        <th className="py-3 px-5 font-semibold text-center">Jumlah Soal</th>
                        <th className="py-3 px-5 font-semibold text-center">Durasi</th>
                        <th className="py-3 px-5 font-semibold text-center">Status</th>
                        {/* <th className="py-3 px-5 font-semibold text-center">Hasil</th> */}
                        <th className="py-3 px-5 font-semibold text-center">Waktu Dimulai</th>
                        <th className="py-3 px-5 font-semibold text-center">Waktu Selesai</th>
                        <th className="py-3 px-5 font-semibold text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {eventList.length === 0 ? (
                    <tr>
                        <td colSpan="8" className="text-center py-8 text-slate-400 italic">
                        Belum ada event quiz yang ditambahkan.
                        </td>
                    </tr>
                    ) : (
                    eventList.map((event) => (
                        <tr key={event.id} className="hover:bg-blue-50/40 transition-all border-b border-slate-100">
                            <td className="px-5 py-3 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-700">
                                    {event.title ? event.title[0].toUpperCase() : "?"}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">{event.title || "-"}</p>
                                    <p className="text-xs text-slate-400">#{event.id}</p>
                                </div>
                            </td>
                            <td className="py-3 px-5 text-slate-700">{event.access_code || "-"}</td>
                            <td className="py-3 px-5 text-slate-700">{event.description || "-"}</td>
                            <td className="py-3 px-5 text-center text-slate-700">
                                <Button
                                    size="default"
                                    variant="link"
                                    className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg w-max h-5"
                                    onClick={() => handleEventQuestion(event)}
                                >
                                    Kelola Soal
                                </Button>
                            </td>
                            <td className="py-3 px-5 text-center text-slate-700">{event.questions?.length || 0}</td>
                            <td className="py-3 px-5 text-center text-slate-700">{event.duration_minutes || 0} menit</td>
                            <td className="px-5 py-3 text-center">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        event.status === "published"
                                        ? "bg-green-200 text-green-700 border border-green-300 w-12"
                                        : event.status === "closed"
                                        ? "bg-red-200 text-red-700 border border-red-300 w-12"
                                        : event.status === "start"
                                        ? "bg-blue-300 text-blue-700 border border-blue-300 w-12"
                                        : event.status === "ongoing"
                                        ? "bg-slate-300 text-slate-700 border border-slate-300 w-12"
                                        : "bg-slate-300 text-slate-700 border border-slate-300 w-12"
                                    }`}>
                                    {event.status === "published"
                                    ? "Publik"
                                    : event.status === "closed"
                                    ? "Ditutup"
                                    : event.status === "start"
                                    ? "Dimulai"
                                    : event.status === "ongoing"
                                    ? "Sedang Berlangsung"
                                    : "Draft"}
                                </span>
                            </td>
                            {/* <td className="px-5 py-3 text-center">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        event.status === "public"
                                        ? "bg-green-200 text-green-700 border border-green-300 w-12"
                                        : "bg-slate-300 text-slate-700 border border-slate-300 w-12"
                                    }`}>
                                    {event.status === "public"
                                    ? "Publik"
                                    : "Private"}
                                </span>
                            </td> */}
                            <td className="py-3 px-5 text-center text-emerald-700 whitespace-nowrap">
                                {event.start_time
                                ? new Date(event.start_time.seconds * 1000).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td className="py-3 px-5 text-center text-amber-700 whitespace-nowrap">
                                {event.end_time
                                ? new Date(event.end_time.seconds * 1000).toLocaleString("id-ID")
                                : "-"}
                            </td>
                            <td className="px-5 py-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded-lg"
                                        onClick={() => handleChangeStatus(event)}
                                    >
                                        <Check size={18} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg"
                                        onClick={() => handleOpenDetail(event)}
                                    >
                                        <Eye size={18} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded-lg"
                                        onClick={() => handleOpenEdit(event)}
                                    >
                                        <Pencil size={18} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg"
                                        onClick={() => handleOpenConfirm(event)}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))
                    )}
                    <ChangeStatusEventModal
                        isOpen={isStatusModalOpen}
                        onClose={() => setIsStatusModalOpen(false)}
                        event={selectedEvent}
                        onStatusUpdated={handleSaveStatus}
                    />
                    <QuizEventDetailModal
                        isOpen={isDetailModalOpen}
                        onClose={() => setIsDetailModalOpen(false)}
                        event={selectedEvent}
                    />
                    <QuizEventEditModal
                        isOpen={openEditModal}
                        onClose={() => setOpenEditModal(false)}
                        event={selectedEvent}
                        onUpdate={handleEventUpdated}
                    />
                    <ConfirmModal
                        isOpen={openConfirmModal}
                        onClose={() => setOpenConfirmModal(false)}
                        onConfirm={handleConfirmDelete}
                        title="Konfirmasi Hapus"
                        message={`Apakah kamu yakin ingin menghapus quiz`}
                        main={`"${selectedEvent?.title}"`}
                    />
                </tbody>
                </table>
            </div>
        </div>
        )}
    </>
    );
}
