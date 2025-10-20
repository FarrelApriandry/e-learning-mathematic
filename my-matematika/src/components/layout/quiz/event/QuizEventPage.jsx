// src/components/layout/quiz/event/QuizEventPage.jsx
import { useState } from "react"
import QuizEventTable from "./QuizEventTable"
import QuizEventFormModal from "../../../ui/quiz/event/QuizEventFormModal"

export default function QuizEventPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const handleEventCreated = () => {
    // trigger refresh ke tabel (bisa pakai props ke QuizEventTable)
    setRefreshTrigger((prev) => prev + 1)
    }

    return (
        <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-white">Daftar Quiz Event</h1>
            <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
            + Tambah Quiz Event
            </button>
        </div>

        {/* Tabel Event */}
        <QuizEventTable refreshTrigger={refreshTrigger} />

        {/* Modal Buat Event */}
        <QuizEventFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreated={handleEventCreated}
        />
        </div>
    )
}
