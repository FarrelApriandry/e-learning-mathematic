// Kartu + skeleton + empty state bersama untuk list publik (materi & quiz).
export function CardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
          <div className="h-5 w-20 rounded-full bg-slate-100" />
          <div className="mt-4 h-5 w-3/4 rounded bg-slate-100" />
          <div className="mt-2 h-4 w-full rounded bg-slate-100" />
          <div className="mt-1 h-4 w-2/3 rounded bg-slate-100" />
          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="h-4 w-24 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, hint, actionHref, actionLabel }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      </div>
      <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{hint}</p>
      {actionHref && (
        <a href={actionHref} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
          {actionLabel}
        </a>
      )}
    </div>
  );
}

function Meta({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      {label}
    </span>
  );
}

const VideoIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
);
const PdfIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
);
const SoalIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
);
const ArrowIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

export function MateriCard({ item, kelas }) {
  return (
    <a
      href={`/materi/kelas/${kelas}/${item.id}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
    >
      <h3 className="font-bold text-slate-900 leading-snug group-hover:text-indigo-700 transition">
        {item.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-slate-500 leading-relaxed">
        {item.description || "Materi pembelajaran matematika SMA."}
      </p>
      {item.materi && (
        <p className="mt-2 text-xs font-medium text-slate-400">Topik: {item.materi}</p>
      )}
      <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
        {item.youtube_link && <Meta icon={VideoIcon} label="Video" />}
        {item.pdf_link && <Meta icon={PdfIcon} label="PDF" />}
        <span className="ml-auto inline-flex items-center gap-1 font-semibold text-indigo-600">
          Buka {ArrowIcon}
        </span>
      </div>
    </a>
  );
}

export function QuizCard({ item, kelas }) {
  const n = Array.isArray(item.questions) ? item.questions.length : 0;
  return (
    <a
      href={`/quiz/kelas/${kelas}/${item.id}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
    >
      <h3 className="font-bold text-slate-900 leading-snug group-hover:text-indigo-700 transition">
        {item.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-slate-500 leading-relaxed">
        {item.description || "Quiz pilihan ganda dengan nilai tersimpan otomatis."}
      </p>
      <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
        <Meta icon={SoalIcon} label={`${n} soal`} />
        <span className="ml-auto inline-flex items-center gap-1 font-semibold text-indigo-600">
          Kerjakan {ArrowIcon}
        </span>
      </div>
    </a>
  );
}
