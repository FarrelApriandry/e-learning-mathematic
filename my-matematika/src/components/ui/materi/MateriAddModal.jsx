import React, { useState, useEffect } from "react";
import { X, BookPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import AlertToast from "../AlertToast.jsx";

// Helper buat ubah ke Title Case
function toTitleCase(str) {
  return str
    .replace(/\b(\w)/g, (s) => s.toUpperCase())
    .replace(/\b(Di|Ke|Dari|Dan|Atau|Yang)\b/g, (s) => s.toLowerCase());
}

export default function MateriAddModal({ open, setOpen }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    class: "",
    materiOption: "new",
    materi: "",
    youtube_link: "",
    pdf_link: "",
  });
  const [materiList, setMateriList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!open) return;
    const fetchMateri = async () => {
      try {
        const res = await fetch("/api/materi");
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          const uniqueMateri = [...new Set(data.data.map((item) => item.materi))];
          setMateriList(uniqueMateri);
        }
      } catch (err) {
        console.error("Gagal ambil data materi:", err);
      }
    };
    fetchMateri();
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedMateri =
      form.materiOption === "existing"
        ? form.materi
        : toTitleCase(form.materi);

    const payload = {
      ...form,
      materi: selectedMateri,
    };

    delete payload.materiOption;

    try {
      const res = await fetch("/api/materi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setAlert({ type: "success", message: data.message });
        setTimeout(() => {
          setOpen(false);
          window.location.reload();
        }, 1200);
      } else {
        setAlert({ type: "error", message: data.message });
      }
    } catch {
      setAlert({ type: "error", message: "Terjadi kesalahan jaringan." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open &&
        createPortal(
          <AnimatePresence>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[500]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookPlus className="w-6 h-6 dark:text-gray-100" strokeWidth={1.5} />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Tambah Materi Baru
                    </h2>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className=" text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition top-1/2"
                  >
                    <X className="w-6 h-6 dark:text-gray-100 hover:dark:text-gray-300" strokeWidth={1.5}/>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Judul
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Judul Materi"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Deskripsi
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Deskripsi Materi"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      required
                    />
                  </div>

                  {/* Class (Dropdown) */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Kelas
                    </label>
                    <select
                      name="class"
                      value={form.class}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      required
                    >
                      <option value="">Pilih Kelas</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </select>
                  </div>

                  {/* Pilihan Materi */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pilihan Materi
                      </h3>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="materiOption"
                            value="new"
                            checked={form.materiOption === "new"}
                            onChange={handleChange}
                            className="accent-indigo-600"
                          />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            Materi Baru
                          </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="materiOption"
                            value="existing"
                            checked={form.materiOption === "existing"}
                            onChange={handleChange}
                            className="accent-indigo-600"
                          />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            Materi Lama
                          </span>
                        </label>
                      </div>
                    </div>

                  {/* Materi Input / Dropdown */}
                  {form.materiOption === "new" ? (
                    <div>
                      <input
                        type="text"
                        name="materi"
                        value={form.materi}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            materi: toTitleCase(e.target.value),
                          })
                        }
                        placeholder="Masukkan nama materi baru"
                        className="w-full h-[42px] px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <select
                        name="materi"
                        value={form.materi}
                        onChange={handleChange}
                        className="w-full h-[42px] px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        required
                      >
                        <option className="hidden" value="">Pilih Materi</option>
                        {materiList.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* YouTube Link */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Link YouTube
                    </label>
                    <input
                      type="text"
                      name="youtube_link"
                      value={form.youtube_link}
                      onChange={handleChange}
                      placeholder="Link YouTube melalui fitur share"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>

                  {/* PDF Link */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Link PDF
                    </label>
                    <input
                      type="text"
                      name="pdf_link"
                      value={form.pdf_link}
                      onChange={handleChange}
                      placeholder="Link PDF melalui drive"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition flex justify-center items-center gap-2"
                  >
                    {loading ? "Menyimpan..." : "Simpan Materi"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
      {alert && <AlertToast type={alert.type} message={alert.message} />}
    </>
  );
}
