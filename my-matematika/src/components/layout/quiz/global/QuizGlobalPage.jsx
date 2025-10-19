// src/components/layout/quiz/global/QuizGlobalPage.jsx
import { useState } from "react";
import QuizGlobalTable from "./QuizGlobalTable";
import QuizGlobalFormModal from "../../../ui/quiz/global/QuizGlobalFormModal";

export default function QuizGlobalPage() {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Daftar Quiz Global</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setOpen(true)}
                >
                    Tambah Quiz
                </button>
            </div>

            <QuizGlobalTable />
            <QuizGlobalFormModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onSuccess={() => console.log("Quiz global added!")}
            />
        </div>
    );
}
