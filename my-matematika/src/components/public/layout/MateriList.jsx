// src/components/materi/MateriList.jsx
import { useEffect, useState } from "react"
import { fetchMateri } from "../../../lib/apiClient.js"
import { CardSkeleton, EmptyState, MateriCard } from "./cards.jsx"

export default function MateriList({ kelas }) {
    const [materi, setMateri] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
        try {
            const data = await fetchMateri()
            setMateri((Array.isArray(data) ? data : []).filter((m) => m.class === kelas))
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
        }

        load()
    }, [kelas])

    if (loading) return <CardSkeleton />

    if (materi.length === 0)
        return (
        <EmptyState
            title={`Belum ada materi kelas ${kelas}`}
            hint="Materi untuk kelas ini sedang disiapkan. Sementara itu, coba quiz yang tersedia."
            actionHref="/quiz/"
            actionLabel="Lihat Quiz"
        />
        )

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {materi.map((m) => (
            <MateriCard key={m.id} item={m} kelas={kelas} />
        ))}
        </div>
    )
}
