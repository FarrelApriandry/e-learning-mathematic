// src/components/admin/SettingsPanel.jsx
// Form pengaturan situs: URL video tutorial untuk popup publik.
import { useEffect, useState } from "react";
import { toast } from "../../hooks/use-toast.js";
import { apiRequest } from "../../lib/apiClient.js";
import { MonitorPlay, Save } from "lucide-react";

const KEY = "intro_video_url";

const YT_WATCH = /^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/;
const YT_SHORT = /^https:\/\/youtu\.be\/[\w-]+/;
const DRIVE = /^https:\/\/drive\.google\.com\/file\/d\/[\w-]+\/view/;

// Ubah URL mentah jadi URL embed untuk preview + popup
export function toEmbedUrl(url) {
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

export default function SettingsPanel() {
  const [value, setValue] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    apiRequest(`/api/settings?key=${KEY}`)
      .then((d) => {
        setValue(d?.data?.value || "");
        setSavedAt(d?.data?.updated_at ? new Date(d.data.updated_at) : null);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest("/api/settings", {
        method: "PUT",
        body: JSON.stringify({ key: KEY, value: value.trim() }),
      });
      setSavedAt(new Date());
      toast({ title: "Tersimpan", description: "Video tutorial diperbarui." });
    } catch (err) {
      toast({
        title: "Gagal menyimpan",
        description: err.message || "Coba lagi.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const trimmed = value.trim();
  const embed = toEmbedUrl(trimmed);
  const invalid = trimmed !== "" && !YT_WATCH.test(trimmed) && !YT_SHORT.test(trimmed) && !DRIVE.test(trimmed);

  if (!loaded) {
    return (
      <div className="max-w-4xl space-y-4">
        <div className="h-11 w-64 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <MonitorPlay className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Video Tutorial</h2>
          <p className="text-sm text-slate-500">
            URL video panduan penggunaan website (popup beranda).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* KIRI: form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <form onSubmit={save} className="space-y-4">
            <div>
              <label
                htmlFor="intro-video-url"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                URL Video (YouTube atau Google Drive)
              </label>
              <input
                id="intro-video-url"
                type="url"
                value={value}
                onInput={(e) => setValue(e.target.value)}
                placeholder="https://drive.google.com/file/d/.../view"
                className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Kosongkan untuk menyembunyikan popup. Format: link YouTube
                (watch / youtu.be) atau Google Drive (.../view).
              </p>
              {invalid && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  Format URL tidak dikenali — popup tidak akan menampilkan
                  video ini.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {savedAt
                  ? `Terakhir diubah: ${savedAt.toLocaleString("id-ID")}`
                  : "Belum pernah diubah"}
              </span>
              <button
                type="submit"
                disabled={saving || invalid}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>

        {/* KANAN: preview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-slate-700">Preview</p>
          {embed ? (
            <div className="aspect-video w-full overflow-hidden rounded-xl border shadow-sm">
              <iframe
                className="h-full w-full"
                src={embed}
                allow="autoplay"
                allowFullScreen
                title="Preview video tutorial"
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
              <p className="text-sm text-slate-400">
                Belum ada video — popup disembunyikan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
