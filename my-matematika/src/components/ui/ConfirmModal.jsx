// src/components/common/ConfirmModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
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
                    <button
                        className="btn-primary outline"
                        onClick={!isDeleting ? onClose : undefined}
                        disabled={isDeleting}
                    >
                        Batal
                    </button>
                    <button
                        className="btn-primary destructive"
                        onClick={!isDeleting ? handleConfirm : undefined}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                    </button>
                </div>
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>,
        document.body
    );
}
