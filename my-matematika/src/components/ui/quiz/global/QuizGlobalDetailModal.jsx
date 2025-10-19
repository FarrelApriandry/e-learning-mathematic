// src/components/layout/quiz/QuizGlobalDetailModal.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../dialog";
import { Badge } from "../../badge";
import { ScrollArea } from "../../scroll-area";
import { motion } from "framer-motion";
import { CheckCircle2, CircleHelp } from "lucide-react";

export default function QuizGlobalDetailModal({ isOpen, onClose, quiz }) {
    if (!quiz) return null;

    const statusColor =
        quiz.visibility === "published"
        ? "bg-green-100 text-green-700"
        : quiz.visibility === "draft"
        ? "bg-gray-100 text-gray-700"
        : "bg-red-100 text-red-700";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-6 rounded-2xl shadow-lg border border-slate-200">
            {/* Header */}
            <DialogHeader className="mb-4 border-b">
            <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {quiz.title}
                <Badge className={`${statusColor} text-xs px-3 py-1 capitalize`}>
                {quiz.visibility === "published"
                    ? "Publik"
                    : quiz.visibility === "draft"
                    ? "Draft"
                    : "Tutup"}
                </Badge>
            </DialogTitle>
            <p className="text-slate-500 text-sm mt-1">
                Detail lengkap untuk quiz global ini.
            </p>
            </DialogHeader>

            {/* Isi Detail */}
            <ScrollArea className="max-h-[70vh] pr-2">
            <div className="space-y-6">
                {/* Informasi Umum */}
                <motion.div
                className="bg-slate-50 p-4 rounded-xl border border-slate-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                >
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Informasi Umum
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                    <p className="text-slate-500">Deskripsi</p>
                    <p className="font-medium text-slate-800">{quiz.description || "-"}</p>
                    </div>
                    <div>
                    <p className="text-slate-500">Kategori</p>
                    <p className="font-medium text-slate-800">{quiz.category || "-"}</p>
                    </div>
                    <div>
                    <p className="text-slate-500">Jumlah Soal</p>
                    <p className="font-medium text-slate-800">{quiz.questions?.length || 0} Soal</p>
                    </div>
                    <div>
                    <p className="text-slate-500">Visibility</p>
                    <Badge className={`${statusColor} text-xs font-medium px-3 py-1 rounded-md`}>
                        {quiz.visibility === "published"
                        ? "Publik"
                        : quiz.visibility === "draft"
                        ? "Draft"
                        : "Tutup"}
                    </Badge>
                    </div>
                </div>
                </motion.div>

                {/* Daftar Soal */}
                <motion.div
                className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                >
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <CircleHelp size={18} className="text-blue-500" />
                    Daftar Soal
                </h3>

                {quiz.questions?.length > 0 ? (
                    <div className="space-y-5">
                    {quiz.questions.map((q, idx) => {
                        const answerIndex = parseInt(q.answer);
                        const correctLetter = String.fromCharCode(65 + answerIndex);
                        const correctText = q.options?.[answerIndex] || "";

                        return (
                        <motion.div
                            key={idx}
                            className="p-4 rounded-lg border border-gray-300 bg-slate-50 hover:bg-slate-100 transition-all duration-200 shadow-sm"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            {/* Nomor & Soal */}
                            <p className="font-semibold text-slate-800 mb-3">
                            {idx + 1}. {q.question}
                            </p>

                            {/* Pilihan Jawaban */}
                            <div className="grid grid-cols-2 gap-2">
                            {q.options?.map((opt, i) => {
                                const optionLetter = String.fromCharCode(65 + i);
                                const isCorrect = i === answerIndex;

                                return (
                                <div
                                    key={i}
                                    className={`flex items-center gap-2 border px-3 py-2 rounded-md text-sm transition ${
                                    isCorrect
                                        ? "border-green-400 bg-green-50 text-green-700"
                                        : "border-gray-200 bg-white hover:bg-gray-50"
                                    }`}
                                >
                                    {isCorrect ? (
                                    <CheckCircle2 size={16} className="text-green-500" />
                                    ) : (
                                    <span className="w-[16px]" />
                                    )}
                                    <span
                                    className={`font-medium ${
                                        isCorrect ? "text-green-700" : "text-slate-800"
                                    }`}
                                    >
                                    {optionLetter}.
                                    </span>
                                    <span>{opt}</span>
                                </div>
                                );
                            })}
                            </div>

                            {/* Penanda Jawaban Benar */}
                            <p className="text-xs mt-3 text-green-600 font-medium">
                            Jawaban benar: {correctLetter}. {correctText}
                            </p>
                        </motion.div>
                        );
                    })}
                    </div>
                ) : (
                    <p className="text-slate-500 italic">Belum ada soal.</p>
                )}
                </motion.div>
            </div>
            </ScrollArea>
        </DialogContent>
        </Dialog>
    );
}
