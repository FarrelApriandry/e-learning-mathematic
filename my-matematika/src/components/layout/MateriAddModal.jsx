import React, { useState } from "react";
import { X, BookPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AlertToast from "../ui/AlertToast.jsx";
import { createPortal } from "react-dom";

export default function MateriAddModal({ open, setOpen }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    class: "",
    materi: "",
    youtube_link: "",
    pdf_link: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...form };

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
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
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
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                >
                  <X size={20} />
                </button>
                <div class="flex items-center mb-4 gap-2">
                  <BookPlus className="w-6 h-6 dark:text-gray-100" strokeWidth={1.5} />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Tambah Materi Baru
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {["title", "description", "class", "materi", "youtube_link", "pdf_link"].map(
                    (key) => (
                      <div key={key}>
                        <label className="block text-sm font-medium capitalize mb-1 text-gray-700 dark:text-gray-300">
                          {key.replace("_", " ")}
                        </label>
                        <input
                          type="text"
                          name={key}
                          value={form[key]}
                          onChange={handleChange}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                          required
                        />
                      </div>
                    )
                  )}

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
