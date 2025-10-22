// src/components/common/ConfirmModal.jsx
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "./dialog";
import { Button } from "./button";

export default function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Konfirmasi", 
    message = "Apakah kamu yakin ingin melanjutkan tindakan ini?",
    main = "Quiz ini" 
    }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
        await onConfirm?.();
        onClose();
        } catch (err) {
        console.error(err);
        } finally {
        setIsProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white text-gray-800 shadow-2xl border border-gray-200 rounded-2xl p-6">
            <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-slate-800">
                {title}
            </DialogTitle>
            </DialogHeader>

            <p className="text-gray-600 mt-1 mb-6">{message} <p className="text-red-600">{main}?</p></p>

            <DialogFooter className="flex justify-end gap-3">
            <Button
                type="button"
                variant="outline"
                disabled={isProcessing}
                onClick={onClose}
                className="border-gray-300 text-slate-700 hover:bg-gray-100"
            >
                Batal
            </Button>
            <Button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirm}
                className={`bg-red-600 hover:bg-red-700 text-white ${
                isProcessing ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
                {isProcessing ? (
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
                    Memproses...
                </span>
                ) : (
                "Ya, Lanjutkan"
                )}
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}
