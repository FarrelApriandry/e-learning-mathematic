// src/components/materi/QuizList.jsx
import { useEffect, useState } from "react"
import { fetchQuizMateri } from "../../../lib/apiClient.js"
import { CardSkeleton, EmptyState, QuizCard } from "./cards.jsx"

export default function QuizList({ kelas }) {
    const [quiz, setQuiz] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
        try {
            const data = await fetchQuizMateri({ class: kelas, status: "published" })
            setQuiz(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
        }

        load()
    }, [kelas])

    if (loading) return <CardSkeleton />

    if (quiz.length === 0)
        return (
        <EmptyState
            title={`Belum ada quiz kelas ${kelas}`}
            hint="Quiz untuk kelas ini sedang disiapkan. Coba pelajari materinya dulu."
            actionHref="/materi/"
            actionLabel="Lihat Materi"
        />
        )

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quiz.map((q) => (
            <QuizCard key={q.id} item={q} kelas={kelas} />
        ))}
        </div>
    )
}
