import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../button.jsx";
import { Input } from "../input.jsx";
import { Textarea } from "../textarea.jsx";
import { BookOpen, ExternalLink, FileText, X, Save } from "lucide-react";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { toast } from "../../../hooks/use-toast.js";

export default function MateriEditModal({ isOpen, onClose, materi, onSave }) {
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        class: "",
        description: "",
        youtube_link: "",
        pdf_link: "",
    });

    useEffect(() => setMounted(true), []);
    useEffect(() => {
        if (materi) {
        setFormData({
            title: materi.title || "",
            class: materi.class || "",
            description: materi.description || "",
            youtube_link: materi.youtube_link || "",
            pdf_link: materi.pdf_link || "",
        });
        }
    }, [materi]);

    if (!mounted || typeof document === "undefined" || !isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await fetch("/api/materi", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: materi.id, ...formData }),
        });

        const result = await res.json();
        if (result.success) {
            toast({ title: "Materi berhasil diperbarui!" });
            onSave?.(formData);
            onClose();
        } else {
            toast({ title: `Gagal memperbarui: ${result.message}`, variant: "destructive" });
        }
        } catch (err) {
        console.error("Update error:", err);
        toast({ title: "Terjadi kesalahan saat menyimpan data.", variant: "destructive" });
        }
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
        {isOpen && (
            <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[500] p-4 sm:p-6"
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
                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-6 py-4 flex justify-between items-center border-b border-white/20 sticky top-0 z-10">
                <h2 className="text-xl sm:text-2xl font-semibold">
                    Edit Materi
                </h2>
                <button onClick={onClose}>
                    <X size={26} className="text-white hover:text-slate-200" />
                </button>
                </div>

                {/* CONTENT */}
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="Judul Materi" name="title" value={formData.title} onChange={handleChange} icon={<BookOpen size={16} />} />
                    <FormField label="Kelas" name="class" value={formData.class} onChange={handleChange} icon={<BookOpen size={16} />} />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">Deskripsi</label>
                    <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tulis deskripsi materi..."
                    className="mt-2 bg-slate-50/70 border border-slate-300 rounded-xl resize-none"
                    rows={4}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="Link YouTube" name="youtube_link" value={formData.youtube_link} onChange={handleChange} icon={<ExternalLink size={16} />} />
                    <FormField label="Link PDF" name="pdf_link" value={formData.pdf_link} onChange={handleChange} icon={<FileText size={16} />} />
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <Button type="button" variant="outline" onClick={onClose}>
                    Batal
                    </Button>
                    <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2">
                    <Save size={18} /> Simpan Perubahan
                    </Button>
                </div>
                </form>
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>,
        document.body
    );
    }

    function FormField({ label, name, value, onChange, icon }) {
    return (
        <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400">{icon}</span>
            <Input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="pl-9 bg-slate-50/70 border border-slate-300 rounded-xl"
            />
        </div>
        </div>
    );
}
