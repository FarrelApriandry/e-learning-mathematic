// src/components/layout/quiz/QuizMateriPage.jsx
import { useState } from "react";
import QuizMateriTable from "./QuizMateriTable";
import QuizMateriFormModal from "../../../ui/quiz/materi/QuizMateriFormModal";

export default function QuizMateriPage() {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Daftar Quiz Materi</h1>
            <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => setOpen(true)}
            >
            Tambah Quiz
            </button>
        </div>

        <QuizMateriTable />
        <QuizMateriFormModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onSuccess={() => console.log("Quiz added!")}
        />
        </div>
    );
    }
