// src/components/ui/quiz/QuizMateriEditModal.jsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../dialog";
import { Input } from "../../input";
import { Textarea } from "../../textarea";
import { Button } from "../../button";
import { ScrollArea } from "../../scroll-area"; // ⬅️ tambahkan ini
import { motion } from "framer-motion";
import { toast } from "../../../../hooks/use-toast";
import { collection, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../lib/firebaseConfig";
import { PlusCircle, Trash2 } from "lucide-react";

export default function QuizMateriEditModal({ isOpen, onClose, quiz, onUpdate }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        class: "",
        materi: "",
        status: "draft",
        questions: [],
    });

    // Di dalam komponen:
    const [materiList, setMateriList] = useState([]);

    useEffect(() => {
        if (quiz) {
            setFormData({
                title: quiz.title || "",
                description: quiz.description || "",
                class: quiz.class || "",
                materi: quiz.materi || "",
                status: quiz.status || "draft",
                questions: Array.isArray(quiz.questions) ? quiz.questions : [],
            });
        }
        const fetchMateri = async () => {
                try {
                const snap = await getDocs(collection(db, "materi"));
                // Ambil field "materi" dari tiap dokumen
                const data = snap.docs.map((doc) => doc.data().materi);
                // Hapus duplikat biar unik
                const unique = [...new Set(data)];
                setMateriList(unique);
                } catch (err) {
                console.error("Gagal ambil data materi:", err);
                }
            };
        fetchMateri();
    }, [quiz]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const [loading, setLoading] = useState(false);

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[index][field] = value;
        setFormData({ ...formData, questions: updatedQuestions });
    };

    const handleAddQuestion = () => {
        setFormData((prev) => ({
            ...prev,
            questions: [
                ...prev.questions,
                { question: "", options: ["", "", "", ""], answer: "" },
            ],
        }));
    };

    const handleRemoveQuestion = (index) => {
        const updated = formData.questions.filter((_, i) => i !== index);
        setFormData({ ...formData, questions: updated });
    };

    const handleSave = async () => {
        
        if (!formData.title.trim() || !formData.description.trim() || !formData.materi.trim()) {
        toast({ title: "Semua field utama harus diisi!", variant: "destructive" });
        return;
        }
    
        if (formData.questions.length === 0) {
        toast({ title: "Tambahkan minimal satu soal!", variant: "destructive" });
        return;
        }
    
        for (let i = 0; i < formData.questions.length; i++) {
        const q = formData.questions[i];
    g
        if (!q.question.trim()) {
            toast({ title: `Soal ${i + 1} belum diisi!`, variant: "destructive" });
            return;
        }

        if (q.options.some(opt => !opt.trim())) {
            toast({ title: `Semua opsi pada soal ${i + 1} harus diisi!`, variant: "destructive" });
            return;
        }

        if (q.answer === "" || q.answer == null || isNaN(q.answer)) {
            toast({ title: `Pilih jawaban benar untuk soal ${i + 1}!`, variant: "destructive" });
            return;
        }
        }

        setLoading(true);
        try {
        const quizRef = doc(db, "quiz_materi", quiz.id);
        await updateDoc(quizRef, {
            ...formData,
            updated_at: serverTimestamp(),
        });
    
        toast({ title: "Quiz berhasil diperbarui!" });
        onUpdate?.({ ...quiz, ...formData });
        onClose();
        } catch (error) {
        console.error("❌ Gagal update quiz:", error);
        toast({ title: "Gagal memperbarui quiz", variant: "destructive" });
        } finally {
        setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-6 rounded-2xl shadow-lg border border-slate-200">
                <DialogHeader className="border-b pb-3">
                    <DialogTitle className="text-2xl font-bold text-slate-800">
                        Edit Quiz: {quiz?.title}
                    </DialogTitle>
                    <p className="text-slate-500 text-sm mt-1">
                        Ubah informasi quiz dan soal-soalnya di sini.
                    </p>
                </DialogHeader>

                {/* Scrollable Content */}
                <ScrollArea className="max-h-[70vh] pr-2">
                    <div className="space-y-5 px-3">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Judul Quiz
                                </label>
                                <Input
                                    name="title"
                                    className="border md:text-base border-gray-300"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Masukkan judul quiz..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">
                                        Jenis Materi
                                    </label>
                                    <select
                                        name="materi"
                                        value={formData.materi}
                                        onChange={handleChange}
                                        required
                                        className="md:text-base w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 bg-white"
                                    >
                                        <option className="hidden" value="">-- Pilih Materi --</option>
                                        {materiList.map((m, i) => (
                                        <option key={i} value={m}>
                                            {m}
                                        </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">
                                        Jenis Kelas
                                    </label>
                                    <select
                                        name="class"
                                        value={formData.class}
                                        onChange={handleChange}
                                        required
                                        className="md:text-base w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 bg-white"
                                    >
                                        <option className="hidden" value="">-- Pilih Kelas --</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700">
                                Deskripsi
                            </label>
                            <Textarea
                                name="description"
                                className="md:text-base border border-gray-300"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Deskripsi singkat tentang quiz..."
                                rows={3}
                            />
                        </div>

                        {/* List Soal */}
                        <motion.div
                            className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Daftar Soal
                                </h3>
                                <Button
                                    onClick={handleAddQuestion}
                                    variant="outline"
                                    className="flex items-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
                                >
                                    <PlusCircle size={16} /> Tambah Soal
                                </Button>
                            </div>

                            {formData.questions.map((q, index) => (
                                <motion.div
                                    key={index}
                                    className="p-4 border border-gray-300 bg-white rounded-lg shadow-sm"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-medium text-slate-800">Soal {index + 1}</p>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleRemoveQuestion(index)}
                                            className="text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>

                                    <div className="h-px bg-gray-300 mb-3"></div>

                                    {/* Input Pertanyaan */}
                                    <Input
                                        value={q.question}
                                        onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                                        placeholder="Tulis pertanyaan di sini..."
                                        className="mb-3 rounded-lg border border-gray-300"
                                    />

                                    {/* Opsi Jawaban */}
                                    <div className="grid grid-cols-2 gap-3 p-3">
                                    {q.options.map((opt, i) => (
                                        <div key={i} className="flex items-center rounded-lg border border-gray-300">
                                            <span className="w-6 font-semibold ml-4 text-slate-700">
                                                {String.fromCharCode(65 + i)}.
                                            </span>
                                            <Input
                                                className="border border-gray-300 rounded-lg"
                                                value={opt}
                                                onChange={(e) => {
                                                const newOptions = [...q.options];
                                                newOptions[i] = e.target.value;
                                                handleQuestionChange(index, "options", newOptions);
                                                }}
                                                placeholder={`Opsi ${String.fromCharCode(65 + i)}`}
                                            />
                                        </div>
                                    ))}
                                    </div>

                                    {/* Jawaban Benar */}
                                    <div className="mt-4">
                                    <label className="text-sm text-slate-700 font-medium">
                                        Pilih Jawaban Benar
                                    </label>
                                    <select
                                        value={q.answer}
                                        onChange={(e) =>
                                        handleQuestionChange(index, "answer", parseInt(e.target.value))
                                        }
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 text-slate-700 bg-white focus:ring-2 focus:ring-blue-400"
                                    >
                                        <option value={0}>A</option>
                                        <option value={1}>B</option>
                                        <option value={2}>C</option>
                                        <option value={3}>D</option>
                                    </select>
                                    </div>
                                </motion.div>
                                ))}
                        </motion.div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={onClose}>
                                Batal
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {loading ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
