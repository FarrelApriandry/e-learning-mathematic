// src/components/materi/MateriDetail.jsx
import { useEffect, useState } from "react"
import { fetchMateriById } from "../../../lib/apiClient.js"
import { EmptyState } from "./cards.jsx"

function toEmbedUrl(url) {
    if (!url) return url
    if (url.includes("youtu.be")) {
        return url.replace("youtu.be/", "www.youtube.com/embed/").split("?")[0]
    }
    if (url.includes("watch?v=")) {
        return url.replace("watch?v=", "embed/").split("&")[0]
    }
    return url
}

const KELAS_LABEL = { 10: "Kelas 10", 11: "Kelas 11", 12: "Kelas 12" };

export default function MateriDetail({ id }) {
    const [materi, setMateri] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
        try {
            const data = await fetchMateriById(id)
            if (data) setMateri(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
        }

        load()
    }, [id])

    if (loading) {
        return (
        <div className="max-w-3xl mx-auto animate-pulse" aria-hidden="true">
            <div className="h-6 w-24 rounded-full bg-slate-200" />
            <div className="mt-4 h-8 w-3/4 rounded-lg bg-slate-200" />
            <div className="mt-3 h-4 w-1/3 rounded bg-slate-200" />
            <div className="mt-6 aspect-video rounded-2xl bg-slate-200" />
            <div className="mt-6 space-y-2">
            <div className="h-4 rounded bg-slate-200" />
            <div className="h-4 rounded bg-slate-200" />
            <div className="h-4 w-2/3 rounded bg-slate-200" />
            </div>
        </div>
        )
    }

    if (!materi) {
        return (
        <div className="max-w-3xl mx-auto">
            <EmptyState
            title="Materi tidak ditemukan"
            hint="Tautan yang kamu buka sudah tidak tersedia atau sudah dihapus."
            actionHref="/materi/"
            actionLabel="Kembali ke daftar materi"
            />
        </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
        <a href={`/materi/kelas/${materi.class || "10"}/`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            {KELAS_LABEL[materi.class] || "Daftar materi"}
        </a>

        <div className="mt-4 flex flex-wrap items-center gap-2">
            {materi.class && (
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-200">
                {KELAS_LABEL[materi.class] || `Kelas ${materi.class}`}
            </span>
            )}
            {materi.materi && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {materi.materi}
            </span>
            )}
        </div>

        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {materi.title}
        </h1>

        {materi.description && (
            <p className="mt-3 text-base text-slate-600 leading-relaxed">{materi.description}</p>
        )}

        {materi.youtube_link && (
            <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Video pembahasan</h2>
            <div className="mt-3 aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
                <iframe
                className="h-full w-full"
                src={toEmbedUrl(materi.youtube_link)}
                title={`Video: ${materi.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                ></iframe>
            </div>
            </div>
        )}

        {materi.pdf_link && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                </div>
                <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-900">Ringkasan materi (PDF)</div>
                <div className="text-xs text-slate-500">Unduh untuk dibaca offline</div>
                </div>
                <a
                href={materi.pdf_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
                Unduh PDF
                </a>
            </div>
            </div>
        )}
        </div>
    )
}
