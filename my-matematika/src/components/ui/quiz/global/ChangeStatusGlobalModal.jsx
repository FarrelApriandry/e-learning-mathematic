import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../dialog";
import { Button } from "../../button";
import { CheckCircle, XCircle } from "lucide-react";
import { db } from "../../../../lib/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "../../../../hooks/use-toast";

export default function ChangeStatusModal({ isOpen, onClose, quiz, onStatusUpdated }) {
    const [newStatus, setNewStatus] = useState(quiz?.status || "draft");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!quiz?.id) return;

        setLoading(true);
        try {
        const quizRef = doc(db, "quiz_global", quiz.id);
        await updateDoc(quizRef, { status: newStatus });

        toast({
            title: "Status berhasil diubah",
            description: `Status quiz diubah menjadi "${newStatus}"`,
        });

        onStatusUpdated?.(newStatus);
        onClose();
        } catch (error) {
            console.error("Gagal update status:", error);
            toast({
                title: "Gagal mengubah status quiz",
                description: "Terjadi kesalahan saat menyimpan perubahan.",
                variant: "destructive",
            });
        } finally {
        setLoading(false);
        }
    };

    if (!quiz) return null;

    return (
        <AnimatePresence>
        {isOpen && (
            <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg p-6 rounded-2xl shadow-lg border border-slate-200 bg-white">
                <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-slate-800">
                    Ubah Status Quiz
                </DialogTitle>
                </DialogHeader>

                <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 mt-2"
                >
                <div>
                    <p className="text-sm text-slate-500 mb-1">Judul Quiz:</p>
                    <p className="font-medium text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                    {quiz.title}
                    </p>
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">
                    Pilih Status Baru
                    </label>
                    <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 bg-white"
                    >
                    <option value="published">Published</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                    </select>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-sm text-slate-600">
                    <p className="font-medium text-slate-700 mb-1">Catatan:</p>
                    <ul className="list-disc list-inside space-y-1">
                    <li>
                        <span className="font-semibold text-green-600">Published</span> — quiz akan
                        tampil untuk siswa dan dapat diakses.
                    </li>
                    <li>
                        <span className="font-semibold text-red-600">Closed</span> — quiz tampil tapi
                        tidak dapat diakses.
                    </li>
                    <li>
                        <span className="font-semibold text-slate-600">Draft</span> — quiz hanya tersimpan, belum tampil.
                    </li>
                    </ul>
                </div>
                </motion.div>

                <DialogFooter className="flex justify-end gap-3 mt-6">
                <Button
                    variant="outline"
                    className="border-slate-300 text-slate-600 hover:bg-slate-100"
                    onClick={onClose}
                    disabled={loading}
                >
                    <XCircle size={16} className="mr-1" /> Batal
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className={`rounded-lg text-white ${
                    loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    <CheckCircle size={16} className="mr-1" />
                    {loading ? "Menyimpan..." : "Simpan"}
                </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        )}
        </AnimatePresence>
    );
    }
