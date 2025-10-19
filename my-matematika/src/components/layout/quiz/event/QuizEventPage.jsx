// src/components/layout/quiz/event/QuizEventPage.jsx
import { useState } from "react";
import QuizEventTable from "./QuizEventTable";
// import QuizEventFormModal from "../../../ui/quiz/event/QuizEventFormModal";

export default function QuizEventPage() {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Daftar Quiz Event</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setOpen(true)}
                >
                    Tambah Event
                </button>
            </div>

            Tabel Event
            <QuizEventTable />

            {/* Modal Create Event */}
            {/* <QuizEventFormModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onSuccess={() => console.log("Event berhasil ditambahkan!")}
            /> */}
        </div>
    );
}
