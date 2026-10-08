import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchMateri } from "../../../lib/apiClient.js";

// Stagger halus: kartu muncul berurutan 50ms sekali jalan (reveal only)
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const KELAS_LABEL = { 10: "Kelas 10", 11: "Kelas 11", 12: "Kelas 12" };

function Skeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
          <div className="h-5 w-20 rounded-full bg-slate-100" />
          <div className="mt-4 h-5 w-3/4 rounded bg-slate-100" />
          <div className="mt-2 h-4 w-full rounded bg-slate-100" />
          <div className="mt-1 h-4 w-2/3 rounded bg-slate-100" />
          <div className="mt-5 flex gap-2">
            <div className="h-6 w-16 rounded-full bg-slate-100" />
            <div className="h-6 w-16 rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      </div>
      <h3 className="mt-4 font-bold text-slate-900">Belum ada materi</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">Materi baru sedang disiapkan. Cek lagi nanti, atau mulai dari quiz yang tersedia.</p>
      <a href="/quiz/" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
        Lihat Quiz
      </a>
    </div>
  );
}

export default function MateriSection() {
  const [materi, setMateri] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMateri();
        setMateri(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (err) {
        console.error("Gagal memuat data materi:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-600">Materi terbaru</div>
            <h2 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">Mulai dari sini</h2>
          </div>
          <a href="/materi/" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
            Semua materi
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        <div className="mt-8">
          {loading ? <Skeleton /> : materi.length === 0 ? <Empty /> : (
            <motion.div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              variants={gridVariants}
              initial="hidden"
              animate="show"
            >
              {materi.map((item) => (
                <motion.a
                  key={item.id}
                  href={`/materi/kelas/${item.class || "10"}/${item.id}`}
                  variants={cardVariants}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
                >
                  <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-200">
                    {KELAS_LABEL[item.class] || `Kelas ${item.class || "-"}`}
                  </span>
                  <h3 className="mt-3 font-bold text-slate-900 leading-snug group-hover:text-indigo-700 transition">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-slate-500 leading-relaxed">
                    {item.description || "Materi pembelajaran matematika SMA."}
                  </p>
                  <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
                    {item.youtube_link && (
                      <span className="inline-flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                        Video
                      </span>
                    )}
                    {item.pdf_link && (
                      <span className="inline-flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                        PDF
                      </span>
                    )}
                    <span className="ml-auto inline-flex items-center gap-1 font-semibold text-indigo-600">
                      Buka
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
