import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../button.jsx";
import { ExternalLink, FileText, Video, Calendar, BookOpen, X } from "lucide-react";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

export default function MateriDetailModal({ isOpen, onClose, materi }) {
    const [mounted, setMounted] = useState(false);
    const [materiData, setMateriData] = useState(materi || {});

    useEffect(() => setMounted(true), []);
    useEffect(() => setMateriData(materi || {}), [materi]);

    if (!mounted || typeof window === "undefined" || typeof document === "undefined") return null;
    if (!isOpen || !materiData) return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
        {isOpen && (
            <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1000] p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            >
            <motion.div
                className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                {/* HEADER */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-5 sm:px-8 py-4 flex justify-between items-center border-b border-white/20 sticky top-0 z-10">
                <h2 className="text-lg sm:text-2xl font-semibold tracking-tight truncate">
                    {materiData.title || "Tanpa Judul"}
                </h2>
                <button onClick={onClose}>
                    <X size={26} className="text-slate-100 hover:text-slate-300" />
                </button>
                </div>

                {/* CONTENT */}
                <div className="p-5 sm:p-8 space-y-5 sm:space-y-6 text-[14px] sm:text-[15px] text-slate-700">
                {/* DESKRIPSI */}
                <div className="flex flex-col gap-3 border border-gray-300 rounded-xl p-4 bg-slate-50/60">
                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <FileText size={18} className="text-slate-500" />
                    Deskripsi
                    </div>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {materiData.description || "-"}
                    </p>
                </div>

                {/* GRID DETAIL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <DetailBox icon={<BookOpen size={18} className="text-yellow-500" />} label="Materi" value={materiData.materi || "-"} />
                    <DetailBox icon={<BookOpen size={18} className="text-blue-500" />} label="Kelas" value={materiData.class || "-"} />
                    <DetailBox icon={<Calendar size={18} className="text-emerald-500" />} label="Dibuat Pada" value={materiData.created_at ? new Date(materiData.created_at.seconds * 1000).toLocaleString("id-ID") : "-"} />
                    <DetailBox icon={<Calendar size={18} className="text-orange-500" />} label="Terakhir Diperbarui" value={materiData.updated_at ? new Date(materiData.updated_at.seconds * 1000).toLocaleString("id-ID") : "-"} />
                </div>

                {/* LINK SECTION */}
                <div className="border border-gray-300 rounded-xl p-4 sm:p-5 bg-slate-50/70">
                    <h3 className="text-slate-800 font-semibold mb-3 flex items-center gap-2">
                    <ExternalLink size={18} className="text-indigo-500 font-semibold" /> Sumber Materi
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                    {materiData.youtube_link && (
                        <a href={materiData.youtube_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium border border-blue-100">
                        <Video size={16} /> Lihat Video
                        </a>
                    )}
                    {materiData.pdf_link && (
                        <a href={materiData.pdf_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium border border-indigo-100">
                        <FileText size={16} /> Buka PDF
                        </a>
                    )}
                    {!materiData.youtube_link && !materiData.pdf_link && (
                        <p className="text-slate-500 italic">Tidak ada sumber tambahan.</p>
                    )}
                    </div>
                </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end px-5 sm:px-8 py-4 sm:py-5 bg-slate-100 border-t gap-3">
                <Button variant="outline" onClick={onClose}>Tutup</Button>
                </div>
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>,
        document.body
    );
    }

    function DetailBox({ icon, label, value }) {
    return (
        <div className="flex flex-col gap-2 border border-gray-300 rounded-xl p-4 bg-slate-50/60">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
            {icon} {label}
        </div>
        <p className="text-slate-600 text-sm sm:text-base">{value}</p>
        </div>
    );
}
