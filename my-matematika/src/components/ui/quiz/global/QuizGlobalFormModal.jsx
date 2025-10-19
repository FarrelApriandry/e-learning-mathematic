// src/components/layout/quiz/QuizGlobalFormModal.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "../../../../lib/firebaseConfig";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { Button } from "../../button";
import { Input } from "../../input";
import { Label } from "../../label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../../select";
import { createPortal } from "react-dom";

export default function QuizGlobalFormModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], answer: "" }]);
  const [loading, setLoading] = useState(false);

  // // 🔹 Ambil daftar kategori unik dari Firestore
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const snap = await getDocs(collection(db, "quiz_categories"));
  //       const data = snap.docs.map((doc) => doc.data().category);
  //       const unique = [...new Set(data)];
  //       setCategoryList(unique);
  //     } catch (err) {
  //       console.error("Gagal ambil data kategori:", err);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "" }]);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;

      await addDoc(collection(db, "quiz_global"), {
        title,
        category,
        description,
        questions,
        visibility: "draft", // 🔹 otomatis draft
        created_by: user ? user.email || user.uid : "unknown",
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      // Reset form
      setTitle("");
      setCategory("");
      setDescription("");
      setQuestions([{ question: "", options: ["", "", "", ""], answer: "" }]);

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error adding quiz:", err);
      alert("Gagal menambahkan quiz. Coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 space-y-5 overflow-y-auto max-h-[90vh]"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <h2 className="text-xl font-semibold">Tambah Quiz Global Baru</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3 ">
              {/* Judul */}
              <div>
                <Label>Judul Quiz</Label>
                <Input
                  type="text"
                  className="rounded-lg border border-gray-300"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul quiz"
                  required
                />
              </div>
              <div>
                <Label>Kategori Quiz</Label>
                <Input
                  type="text"
                  className="rounded-lg border border-gray-300"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Masukkan kategori quiz"
                  required
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <Label>Deskripsi Quiz</Label>
              <Input
                type="text"
                className="rounded-lg border border-gray-300"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat quiz"
                required
              />
            </div>

            {/* Daftar Soal */}
            <div className="space-y-4">
              <Label className="font-medium text-gray-800 text-lg">Daftar Soal</Label>

              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="border border-gray-300 rounded-xl p-5 space-y-4 bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <h4 className="font-semibold text-gray-800">Soal {idx + 1}</h4>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(idx)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Hapus
                      </button>
                    )}
                  </div>

                  {/* Pertanyaan */}
                  <div>
                    <Label>Pertanyaan</Label>
                    <Input
                      type="text"
                      className="border border-gray-300"
                      placeholder="Tulis pertanyaan..."
                      value={q.question}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[idx].question = e.target.value;
                        setQuestions(updated);
                      }}
                      required
                    />
                  </div>

                  {/* Opsi Jawaban */}
                  <div className="border border-gray-300 rounded-lg p-4 bg-white">
                    <h5 className="font-medium text-gray-700 mb-2">Opsi Jawaban</h5>
                    <div className="grid grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx}>
                          <Label>Opsi {String.fromCharCode(65 + optIdx)}</Label>
                          <Input
                            type="text"
                            placeholder={`Jawaban ${String.fromCharCode(65 + optIdx)}`}
                            value={opt}
                            onChange={(e) => {
                              const updated = [...questions];
                              updated[idx].options[optIdx] = e.target.value;
                              setQuestions(updated);
                            }}
                            required
                            className="border border-gray-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Jawaban Benar */}
                  <div className="border border-gray-300 rounded-lg p-4 bg-white">
                    <Label>Jawaban Benar</Label>
                    <Select
                      value={q.answer !== "" ? q.answer.toString() : ""}
                      onValueChange={(value) => {
                        const updated = [...questions];
                        updated[idx].answer = parseInt(value, 10);
                        setQuestions(updated);
                      }}
                    >
                      <SelectTrigger className="border border-gray-300">
                        <span>
                          {q.answer !== "" ? String.fromCharCode(65 + q.answer) : "Pilih jawaban benar"}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">A</SelectItem>
                        <SelectItem value="1">B</SelectItem>
                        <SelectItem value="2">C</SelectItem>
                        <SelectItem value="3">D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}

              <div className="flex">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center gap-2 px-2 py-1.5 border border-blue-600 text-blue-600 font-thin rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Soal
                </button>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                onClick={onClose}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
