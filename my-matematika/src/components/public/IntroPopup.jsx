import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, PlayCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"

export default function IntroPopup() {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setOpen(true), 1000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence>
        {open && (
            <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            >
            <motion.div
                className="relative w-full max-w-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120 }}
            >
            {/* Bagian Card */}
                <Card className="border-0 rounded-2xl shadow-lg overflow-hidden">
                {/* Bagian Card Header */}
                <CardHeader className="flex flex-col items-start space-y-2 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <div className="flex justify-between items-center w-full">
                    <CardTitle className="md:text-2xl font-bold text-lg">Cara Menggunakan Website</CardTitle>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-white/70 hover:text-white transition"
                    >
                        <X size={20} />
                    </button>
                    </div>
                    <p className="md:text-sm text-xs text-white/90">
                    Panduan singkat penggunaan AsyikMath Plus — belajar interaktif lewat video & quiz!
                    </p>
                </CardHeader>

                <CardContent className="p-6 space-y-4 bg-white">
                    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md border">
                    <iframe
                        className="w-full h-full"
                        src="https://drive.google.com/file/d/1xurmd-cZBBGI6COVAdLNu9meP67QaimB/preview"
                        allow="autoplay"
                        allowFullScreen
                        title="Panduan AsyikMath"
                    ></iframe>
                    </div>

                    <div className="flex justify-end">
                    <Button onClick={() => setOpen(false)} variant="outline">
                        Tutup
                    </Button>
                    </div>
                </CardContent>
                </Card>
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    )
}
