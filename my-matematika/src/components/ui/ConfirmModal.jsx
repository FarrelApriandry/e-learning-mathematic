// src/components/common/ConfirmModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message}) {
    if (typeof document === "undefined") return null;

    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
        {isOpen && (
            <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
            <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <h2 className="text-lg font-semibold mb-2">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    {/* Tombol Batal */}
                    <button
                        onClick={!isDeleting ? onClose : undefined}
                        disabled={isDeleting}
                        className={`px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all duration-200 ${
                            isDeleting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        Batal
                    </button>
                        {/* Tombol Hapus */}
                    <button
                        onClick={!isDeleting ? handleConfirm : undefined}
                        disabled={isDeleting}
                        className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
                            isDeleting
                                ? "bg-red-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg"
                        }`}
                    >
                        {isDeleting ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                                Menghapus...
                            </span>
                        ) : (
                            "Ya, Hapus"
                        )}
                    </button>
                </div>
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>,
        document.body
    );
}
