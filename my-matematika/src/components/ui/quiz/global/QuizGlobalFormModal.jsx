// src/components/layout/quiz/QuizGlobalFormDialog.jsx
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../dialog"
import { Button } from "../../button"
import { Input } from "../../input"
import { Label } from "../../label"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../select"
import { Textarea } from "../../textarea"
import { db, auth } from "../../../../lib/firebaseConfig"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function QuizGlobalFormDialog({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], answer: "" }])
  const [loading, setLoading] = useState(false)

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "" }])
  }

  const removeQuestion = (index) => {
    const updated = [...questions]
    updated.splice(index, 1)
    setQuestions(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = auth.currentUser

      await addDoc(collection(db, "quiz_global"), {
        title,
        category,
        description,
        questions,
        visibility: "draft",
        created_by: user ? user.email || user.uid : "unknown",
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      })

      setTitle("")
      setCategory("")
      setDescription("")
      setQuestions([{ question: "", options: ["", "", "", ""], answer: "" }])

      onSuccess?.()
      onClose()
    } catch (err) {
      console.error("Error adding quiz:", err)
      alert("Gagal menambahkan quiz. Coba lagi!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-white text-gray-800 shadow-2xl border border-gray-200 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-700">
            Tambah Quiz Global Baru
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Judul Quiz</Label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul quiz"
                required
                className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
              />
            </div>
            <div>
              <Label>Kategori Quiz</Label>
              <Input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Masukkan kategori quiz"
                required
                className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
              />
            </div>
          </div>

          <div>
            <Label>Deskripsi Quiz</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat quiz"
              required
              className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
            />
          </div>

          {/* ====================== DAFTAR SOAL ====================== */}
          <div className="space-y-4">
            <Label className="font-semibold text-lg text-gray-800">Daftar Soal</Label>

            {questions.map((q, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-5 space-y-4 bg-gray-50 shadow-sm">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <h4 className="font-semibold text-blue-700">Soal {idx + 1}</h4>
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

                <div>
                  <Label>Pertanyaan</Label>
                  <Input
                    type="text"
                    placeholder="Tulis pertanyaan..."
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...questions]
                      updated[idx].question = e.target.value
                      setQuestions(updated)
                    }}
                    required
                    className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                  />
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-white">
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
                            const updated = [...questions]
                            updated[idx].options[optIdx] = e.target.value
                            setQuestions(updated)
                          }}
                          required
                          className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <Label>Jawaban Benar</Label>
                  <Select
                    value={q.answer !== "" ? q.answer.toString() : ""}
                    onValueChange={(value) => {
                      const updated = [...questions]
                      updated[idx].answer = parseInt(value, 10)
                      setQuestions(updated)
                    }}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200">
                      <SelectValue placeholder="Pilih jawaban benar" />
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
                className="flex items-center gap-2 px-3 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg shadow-sm hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
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

          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
            <Button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
