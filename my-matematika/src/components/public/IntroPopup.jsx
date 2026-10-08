// src/components/public/IntroPopup.jsx
// Popup panduan video. URL video dibaca dari /api/settings (key intro_video_url,
// dikelola admin di /admin/settings). Video kosong = popup tidak muncul.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { apiRequest } from "../../lib/apiClient.js";

function toEmbedUrl(url) {
  if (!url) return "";
  const ytWatch = url.match(
    /^https:\/\/(www\.)?youtube\.com\/watch\?v=([\w-]+)/
  );
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[2]}`;
  const ytShort = url.match(/^https:\/\/youtu\.be\/([\w-]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
  const drive = url.match(
    /^https:\/\/drive\.google\.com\/file\/d\/([\w-]+)\/view/
  );
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
  return url;
}

export default function IntroPopup() {
  const [open, setOpen] = useState(false);
  const [embedUrl, setEmbedUrl] = useState("");

  useEffect(() => {
    // Sudah ditutup di sesi ini? Jangan fetch apa-apa.
    if (sessionStorage.getItem("intro_seen")) return;

    let alive = true;
    apiRequest("/api/settings?key=intro_video_url")
      .then((d) => {
        if (!alive) return;
        const embed = toEmbedUrl(d?.data?.value || "");
        if (!embed) return; // video kosong: popup tidak muncul
        setEmbedUrl(embed);
        setTimeout(() => alive && setOpen(true), 900);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const close = () => {
    sessionStorage.setItem("intro_seen", "1");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="relative w-full max-w-2xl"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 p-6 pb-4">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 md:text-2xl">
                    Cara Menggunakan Website
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 md:text-sm">
                    Panduan singkat AsyikMath — belajar lewat video & quiz.
                  </p>
                </div>
                <button
                  onClick={close}
                  aria-label="Tutup panduan"
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Video */}
              <div className="px-6">
                <div className="aspect-video w-full overflow-hidden rounded-xl border shadow-sm">
                  <iframe
                    className="h-full w-full"
                    src={embedUrl}
                    allow="autoplay"
                    allowFullScreen
                    title="Panduan AsyikMath"
                  />
                </div>
              </div>

              <div className="flex justify-end p-6">
                <button
                  onClick={close}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
