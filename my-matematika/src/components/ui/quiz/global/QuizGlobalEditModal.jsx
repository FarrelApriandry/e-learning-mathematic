// src/components/layout/quiz/QuizGlobalEditModal.jsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../dialog";
import { Input } from "../../input";
import { Label } from "../../label";
import { Button } from "../../button";
import { Textarea } from "../../textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../select";
import { ScrollArea } from "../../scroll-area";
import { motion } from "framer-motion";
import { toast } from "../../../../hooks/use-toast";
import { db } from "../../../../lib/firebaseConfig";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { PlusCircle, Trash2 } from "lucide-react";

export default function QuizGlobalEditModal({ isOpen, onClose, quiz, onUpdate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    visibility: "draft",
    questions: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (quiz) {
      setFormData({
        title: quiz.title || "",
        description: quiz.description || "",
        category: quiz.category || "",
        visibility: quiz.visibility || "draft",
        questions: Array.isArray(quiz.questions) ? quiz.questions : [],
      });
    }
  }, [quiz]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...formData.questions];
    updated[index][field] = value;
    setFormData({ ...formData, questions: updated });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...formData.questions];
    updated[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: updated });
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
    if (!formData.title.trim() || !formData.description.trim() || !formData.category.trim()) {
      toast({ title: "Semua field utama harus diisi!", variant: "destructive" });
      return;
    }

    if (formData.questions.length === 0) {
      toast({ title: "Tambahkan minimal satu soal!", variant: "destructive" });
      return;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.question.trim()) {
        toast({ title: `Soal ${i + 1} belum diisi!`, variant: "destructive" });
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        toast({ title: `Semua opsi pada soal ${i + 1} harus diisi!`, variant: "destructive" });
        return;
      }
      if (q.answer === "" || isNaN(q.answer)) {
        toast({ title: `Pilih jawaban benar untuk soal ${i + 1}!`, variant: "destructive" });
        return;
      }
    }

    setLoading(true);
    try {
      const quizRef = doc(db, "quiz_global", quiz.id);
      await updateDoc(quizRef, {
        ...formData,
        updated_at: serverTimestamp(),
      });

      toast({ title: "Quiz berhasil diperbarui!" });
      onUpdate?.({ ...quiz, ...formData });
      onClose();
    } catch (error) {
      console.error("❌ Error update quiz:", error);
      toast({ title: "Gagal memperbarui quiz", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-6 rounded-2xl shadow-lg border border-slate-200 bg-white">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-2xl font-bold text-slate-800">
            ✏️ Edit Quiz Global
          </DialogTitle>
          <p className="text-slate-500 text-sm mt-1">
            Ubah detail quiz global beserta daftar soalnya di sini.
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-3 mt-4">
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Informasi Umum */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Judul Quiz</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Masukkan judul quiz"
                />
              </div>
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Select
                  onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}
                  value={formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Umum">Umum</SelectItem>
                    <SelectItem value="Teknologi">Teknologi</SelectItem>
                    <SelectItem value="Sejarah">Sejarah</SelectItem>
                    <SelectItem value="Budaya">Budaya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tuliskan deskripsi quiz..."
              />
            </div>

            {/* Daftar Soal */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  📝 Daftar Soal
                </h3>
                <Button
                  type="button"
                  onClick={handleAddQuestion}
                  className="flex items-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <PlusCircle size={16} /> Tambah Soal
                </Button>
              </div>

              {formData.questions.length > 0 ? (
                <div className="space-y-5">
                  {formData.questions.map((q, index) => (
                    <motion.div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(index)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>

                      <Label className="font-semibold">Soal {index + 1}</Label>
                      <Input
                        value={q.question}
                        onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                        placeholder="Tulis pertanyaan di sini"
                        className="mt-1"
                      />

                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {q.options.map((opt, i) => (
                          <Input
                            key={i}
                            value={opt}
                            onChange={(e) => handleOptionChange(index, i, e.target.value)}
                            placeholder={`Opsi ${String.fromCharCode(65 + i)}`}
                            className="bg-white"
                          />
                        ))}
                      </div>

                      <div className="mt-3">
                        <Label>Pilih Jawaban Benar</Label>
                        <Select
                          value={q.answer}
                          onValueChange={(v) =>
                            handleQuestionChange(index, "answer", parseInt(v))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jawaban benar" />
                          </SelectTrigger>
                          <SelectContent>
                            {["A", "B", "C", "D"].map((letter, i) => (
                              <SelectItem key={i} value={i}>
                                {letter}. {q.options[i] || "-"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic mt-3">
                  Belum ada soal ditambahkan.
                </p>
              )}
            </div>
          </motion.div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg shadow-md"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
