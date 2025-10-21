// src/components/ui/quiz/event/QuizEventDetailModal.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../dialog";
import { Badge } from "../../badge";
import { ScrollArea } from "../../scroll-area";
import { motion } from "framer-motion";
import { CalendarDays, Clock3, FileText, Hash, HelpCircle } from "lucide-react";

export default function QuizEventDetailModal({ isOpen, onClose, event }) {
    if (!event) return null;

    const statusColor =
        event.status === "published"
            ? "bg-green-100 text-green-700"
            : event.status === "closed"
            ? "bg-red-100 text-red-700"
            : event.status === "start"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-700";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl p-6 rounded-2xl shadow-lg border border-slate-200">
                {/* HEADER */}
                <DialogHeader className="mb-4 border-b">
                    <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        {event.title || "Tanpa Judul"}
                        <Badge className={`${statusColor} text-xs px-3 py-1 capitalize`}>
                            {event.status === "published"
                                ? "Publik"
                                : event.status === "closed"
                                ? "Tutup"
                                : event.status === "start"
                                ? "Dimulai"
                                : "Draft"}
                        </Badge>
                    </DialogTitle>
                    <p className="text-slate-500 text-sm mt-1">
                        Detail lengkap dari event quiz ini.
                    </p>
                </DialogHeader>

                {/* ISI DETAIL */}
                <ScrollArea className="max-h-[70vh] pr-2">
                    <div className="space-y-6">
                        {/* Informasi Umum */}
                        <motion.div
                            className="bg-slate-50 p-4 rounded-xl border border-slate-200"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <FileText size={18} className="text-blue-500" />
                                Informasi Umum
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500">Deskripsi</p>
                                    <p className="font-medium text-slate-800">
                                        {event.description || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Kode Akses</p>
                                    <p className="font-medium text-slate-800">
                                        {event.access_code || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Durasi</p>
                                    <p className="font-medium text-slate-800">
                                        {event.duration_minutes || 0} menit
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Jumlah Soal</p>
                                    <p className="font-medium text-slate-800">
                                        {event.questions?.length || 0} Soal
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Waktu Pelaksanaan */}
                        <motion.div
                            className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: 0.05 }}
                        >
                            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <CalendarDays size={18} className="text-amber-500" />
                                Waktu Pelaksanaan
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500">Waktu Mulai</p>
                                    <p className="font-medium text-emerald-700">
                                        {event.start_time
                                            ? new Date(event.start_time.seconds * 1000).toLocaleString("id-ID")
                                            : "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Waktu Selesai</p>
                                    <p className="font-medium text-amber-700">
                                        {event.end_time
                                            ? new Date(event.end_time.seconds * 1000).toLocaleString("id-ID")
                                            : "-"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Status & Metadata */}
                        <motion.div
                            className="bg-slate-50 p-4 rounded-xl border border-slate-200"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: 0.1 }}
                        >
                            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <HelpCircle size={18} className="text-purple-500" />
                                Status & Metadata
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500">Status Event</p>
                                    <Badge className={`${statusColor} text-xs font-medium px-3 py-1 rounded-md`}>
                                        {event.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-slate-500">ID Event</p>
                                    <p className="font-medium text-slate-800">#{event.id}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}