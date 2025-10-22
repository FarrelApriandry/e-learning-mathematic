// src/components/materi/MateriDetail.jsx
import { useEffect, useState } from "react"
import { db } from "../../../lib/firebaseConfig"
import { doc, getDoc } from "firebase/firestore"

export default function MateriDetail({ id }) {
    const [materi, setMateri] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDetail = async () => {
        try {
            const docRef = doc(db, "materi", id)
            const snap = await getDoc(docRef)
            if (snap.exists()) setMateri(snap.data())
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
        }

        fetchDetail()
    }, [id])

    function toEmbedUrl(url) {
        // kalau URL dari youtu.be
        if (url.includes("youtu.be")) {
            return url.replace("youtu.be/", "www.youtube.com/embed/").split("?")[0];
        }
        // kalau URL dari youtube.com/watch?v=
        if (url.includes("watch?v=")) {
            return url.replace("watch?v=", "embed/").split("&")[0];
        }

        console.log(url)
        return url;
    } 

    if (loading) return <p>Loading...</p>
    if (!materi) return <p>Materi tidak ditemukan.</p>


    return (
        <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-indigo-700">
            {materi.title}
        </h1>
        <p className="text-gray-500 mb-6">{materi.materi}</p>

        {materi.youtube_link && (
            <div className="mb-8 aspect-video rounded-2xl overflow-hidden shadow-lg">
            <iframe
                className="w-full h-full"
                src={toEmbedUrl(materi.youtube_link)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
            </div>
        )}

        <article className="prose prose-indigo max-w-none mb-8">
            <p>{materi.description}</p>
        </article>

        {materi.pdf_link && (
            <a
            href={materi.pdf_link}
            target="_blank"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
            📘 Download PDF
            </a>
        )}
        </div>
    )
}
