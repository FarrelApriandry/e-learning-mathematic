// src/components/ui/quiz/event/QuizEventQuestionFormModal.jsx
import { useState } from "react";
    import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../dialog";
import { Input } from "../../input";
import { Label } from "../../label";
import { Button } from "../../button";
import { Textarea } from "../../textarea";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../../select";
import { toast } from "../../../../hooks/use-toast";

export default function QuizEventQuestionFormModal({
    isOpen,
    onClose,
    eventId,
    onCreated,
}) {
    const [questions, setQuestions] = useState([
        { question: "", options: ["", "", "", ""], answer: "" },
    ]);
    const [loading, setLoading] = useState(false);

    // ➕ Tambah soal baru
    const addQuestion = () => {
        setQuestions([
        ...questions,
        { question: "", options: ["", "", "", ""], answer: "" },
        ]);
    };

    // ❌ Hapus soal tertentu
    const removeQuestion = (idx) => {
        const updated = [...questions];
        updated.splice(idx, 1);
        setQuestions(updated);
    };

    // 🧠 Handle submit seluruh soal
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
        const res = await fetch("/api/quiz_event_question", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventId, questions }),
        });

        if (!res.ok) throw new Error("Gagal menambahkan soal");

        toast({
            title: "Berhasil!",
            description: "Semua soal berhasil ditambahkan 🎉",
        });

        onCreated?.();
        onClose();
        } catch (err) {
        console.error(err);
        toast({
            title: "Gagal menambahkan soal",
            variant: "destructive",
        });
        } finally {
        setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white shadow-lg border border-slate-200 text-gray-800 rounded-xl max-h-[85vh] overflow-y-auto p-6">
            <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
                ✏️ Tambah Soal untuk Event
            </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Soal dinamis */}
            <div className="space-y-4">
                <Label className="font-medium text-gray-800 text-lg">
                Daftar Soal
                </Label>

                {questions.map((q, idx) => (
                <div
                    key={idx}
                    className="border border-gray-300 rounded-xl p-5 space-y-4 bg-gray-50 shadow-sm"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <h4 className="font-semibold text-gray-800">
                        📝 Soal {idx + 1}
                    </h4>
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
                    <Textarea
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
                    <h5 className="font-medium text-gray-700 mb-2">
                        Opsi Jawaban
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                        {q.options.map((opt, optIdx) => (
                        <div key={optIdx}>
                            <Label>Opsi {String.fromCharCode(65 + optIdx)}</Label>
                            <Input
                            type="text"
                            placeholder={`Jawaban ${String.fromCharCode(
                                65 + optIdx
                            )}`}
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
                            {q.answer !== ""
                            ? String.fromCharCode(65 + q.answer)
                            : "Pilih jawaban benar"}
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

                {/* Tombol Tambah Soal */}
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
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                    />
                    </svg>
                    Tambah Soal
                </button>
                </div>
            </div>

            {/* Submit */}
            <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
            >
                {loading ? "Menyimpan..." : "Simpan Semua Soal"}
            </Button>
            </form>
        </DialogContent>
        </Dialog>
    );
}
