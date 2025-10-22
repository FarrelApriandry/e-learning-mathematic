// src/components/materi/MateriList.jsx
import { useEffect, useState } from "react"
import { db } from "../../../lib/firebaseConfig"
import { collection, getDocs } from "firebase/firestore"

export default function MateriList({ kelas }) {
    const [materi, setMateri] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMateri = async () => {
        try {
            const colRef = collection(db, "materi")
            const snapshot = await getDocs(colRef)
            const data = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((m) => m.class === kelas)
            setMateri(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
        }

        fetchMateri()
    }, [kelas])

    if (loading)
        return <p className="text-center text-gray-500">Loading materi...</p>

    if (materi.length === 0)
        return <p className="text-center text-gray-500">Belum ada materi.</p>

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {materi.map((m) => (
            <a
            key={m.id}
            href={`/sma/kelas/${kelas}/${m.id}`}
            className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
            <div>
                <h2 className="text-xl font-semibold mb-2 text-indigo-700 group-hover:text-indigo-800">
                {m.title}
                </h2>
                <p className="text-gray-500 text-sm mb-4">{m.description}</p>
                <p className="text-gray-400 text-xs line-clamp-2">{m.materi}</p>
            </div>
            <span className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-medium group-hover:translate-x-1 transition-transform">
                Buka Materi →
            </span>
            </a>
        ))}
        </div>
    )
}
