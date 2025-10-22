// src/components/ui/materi/MateriDetailDialog.jsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../dialog";
import { Button } from "../button";
import {
  ExternalLink,
  FileText,
  Video,
  Calendar,
  BookOpen,
  X,
} from "lucide-react";

export default function MateriDetailDialog({ isOpen, onClose, materi }) {
  const [materiData, setMateriData] = useState(materi || {});

  useEffect(() => setMateriData(materi || {}), [materi]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-6 rounded-2xl shadow-lg border border-slate-2000">
        {/* HEADER */}
        <DialogHeader className="mb-4 border-b ">
          <DialogTitle className="text-lg sm:text-2xl font-semibold truncate">
            {materiData.title || "Tanpa Judul"}
          </DialogTitle>
          <p className="text-slate-500 text-sm mt-1">
                Detail lengkap untuk kuis ini.
            </p>
        </DialogHeader>

        {/* CONTENT */}
        <div className="space-y-6 text-[15px] text-slate-700">
          {/* DESKRIPSI */}
          <div className="flex flex-col gap-3 border border-gray-300 rounded-xl p-4 bg-slate-50/60">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <FileText size={18} className="text-slate-500" />
              Deskripsi
            </div>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {materiData.description || "-"}
            </p>
          </div>

          {/* GRID DETAIL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DetailBox
              icon={<BookOpen size={18} className="text-yellow-500" />}
              label="Materi"
              value={materiData.materi || "-"}
            />
            <DetailBox
              icon={<BookOpen size={18} className="text-blue-500" />}
              label="Kelas"
              value={materiData.class || "-"}
            />
            <DetailBox
              icon={<Calendar size={18} className="text-emerald-500" />}
              label="Dibuat Pada"
              value={
                materiData.created_at
                  ? new Date(materiData.created_at.seconds * 1000).toLocaleString("id-ID")
                  : "-"
              }
            />
            <DetailBox
              icon={<Calendar size={18} className="text-orange-500" />}
              label="Terakhir Diperbarui"
              value={
                materiData.updated_at
                  ? new Date(materiData.updated_at.seconds * 1000).toLocaleString("id-ID")
                  : "-"
              }
            />
          </div>

          {/* LINK SECTION */}
          <div className="border border-gray-300 rounded-xl p-4 sm:p-5 bg-slate-50/70">
            <h3 className="text-slate-800 font-semibold mb-3 flex items-center gap-2">
              <ExternalLink size={18} className="text-indigo-500 font-semibold" /> Sumber Materi
            </h3>
            <div className="flex flex-wrap gap-3">
              {materiData.youtube_link && (
                <a
                  href={materiData.youtube_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-2 text-sm font-medium border border-blue-100"
                >
                  <Video size={16} /> Lihat Video
                </a>
              )}
              {materiData.pdf_link && (
                <a
                  href={materiData.pdf_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-3 py-2 text-sm font-medium border border-indigo-100"
                >
                  <FileText size={16} /> Buka PDF
                </a>
              )}
              {!materiData.youtube_link && !materiData.pdf_link && (
                <p className="text-slate-500 italic">Tidak ada sumber tambahan.</p>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="flex justify-end bg-slate-100 border-t px-6 py-4 rounded-b-3xl">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailBox({ icon, label, value }) {
  return (
    <div className="flex flex-col gap-2 border border-gray-300 rounded-xl p-4 bg-slate-50/60">
      <div className="flex items-center gap-2 text-slate-800 font-semibold">
        {icon} {label}
      </div>
      <p className="text-slate-600 text-sm sm:text-base">{value}</p>
    </div>
  );
}
