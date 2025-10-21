// src/components/forms/QuizEventFormModal.jsx
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../dialog"
import { Input } from "../../input"
import { Label } from "../../label"
import { Button } from "../../button"
import { Textarea } from "../../textarea"
import { Switch } from "../../switch"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "../../select"
import { toast } from "../../../../hooks/use-toast"
import { auth } from "src/lib/firebaseConfig"

export default function QuizEventFormModal({ isOpen, onClose, onCreated }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        duration_minutes: "",
        start_time: "",
        end_time: "",
        randomize_order: false,
        shuffle_options: false,
        is_public_results: true,
        max_participants: "",
    })
    const [loading, setLoading] = useState(false)
    const [categoryMode, setCategoryMode] = useState("select")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSwitch = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const user = auth.currentUser;

            const res = await fetch("/api/quiz_event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Gagal membuat event.")
            const data = await res.json()

            toast({
                title: "Berhasil 🎉",
                description: "Event berhasil dibuat!",
                variant: "default",
            });
            onCreated?.(data)
            onClose()
            setFormData({
                title: "",
                description: "",
                category: "",
                duration_minutes: "",
                start_time: "",
                end_time: "",
                randomize_order: false,
                shuffle_options: false,
                is_public_results: true,
                max_participants: "",
                created_by: user ? user.email || user.uid : "unknown",
                last_modified_by: user ? user.email || user.uid : "unknown",
            })
        } catch (err) {
            console.error(err)
            toast({
                title: "Gagal ❌",
                description: "Terjadi kesalahan saat membuat event =" + {err},
                variant: "destructive",
            });
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg bg-white text-gray-800 shadow-2xl border border-gray-200 rounded-2xl p-6">
            <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-700">
                ✨ Buat Quiz Event Baru
            </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div>
                    <Label htmlFor="title">Judul Event</Label>
                    <Input
                    id="title"
                    name="title"
                    placeholder="Contoh: Quiz Sejarah Indonesia"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                    />
                </div>

                <div>
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                    id="description"
                    name="description"
                    placeholder="Tuliskan deskripsi singkat..."
                    value={formData.description}
                    onChange={handleChange}
                    className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                    />
                </div>

                {/* ====== KATEGORI DENGAN DUAL MODE ====== */}
                <div>
                    {/* Tombol toggle */}
                    <div className="flex gap-2 my-1 justify-between">
                        <Label htmlFor="category">Kategori</Label>
                        <div className="flex gap-2 my-1">
                            <button
                                type="button"
                                onClick={() => setCategoryMode("input")}
                                className={`text-xs px-3 py-1 rounded-md border transition ${
                                categoryMode === "input"
                                    ? "bg-blue-100 border-blue-400 text-blue-700"
                                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                Ketik
                            </button>
                            <button
                                type="button"
                                onClick={() => setCategoryMode("select")}
                                className={`text-xs px-3 py-1 rounded-md border transition ${
                                categoryMode === "select"
                                    ? "bg-blue-100 border-blue-400 text-blue-700"
                                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                Pilih
                            </button>
                        </div>
                    </div>

                    {categoryMode === "select" ? (
                    <Select
                        value={formData.category}
                        onValueChange={(v) =>
                        setFormData((prev) => ({ ...prev, category: v }))
                        }
                    >
                        <SelectTrigger className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200">
                        <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Umum">Umum</SelectItem>
                            <SelectItem value="Teknologi">Teknologi</SelectItem>
                            <SelectItem value="Sejarah">Sejarah</SelectItem>
                            <SelectItem value="Budaya">Budaya</SelectItem>
                        </SelectContent>
                    </Select>
                    ) : (
                    <Input
                        id="category"
                        name="category"
                        placeholder="Tulis kategori custom..."
                        value={formData.category}
                        onChange={handleChange}
                        className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                    />
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                    <Label htmlFor="duration_minutes">Durasi (menit)</Label>
                    <Input
                        type="number"
                        id="duration_minutes"
                        name="duration_minutes"
                        value={formData.duration_minutes}
                        onChange={handleChange}
                        className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                    />
                    </div>
                    <div>
                    <Label htmlFor="max_participants">Maks. Peserta</Label>
                    <Input
                        type="number"
                        id="max_participants"
                        name="max_participants"
                        value={formData.max_participants}
                        onChange={handleChange}
                        className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                    />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                    <Label htmlFor="start_time">Mulai</Label>
                    <Input
                        type="datetime-local"
                        id="start_time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                    />
                    </div>
                    <div>
                    <Label htmlFor="end_time">Selesai</Label>
                    <Input
                        type="datetime-local"
                        id="end_time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                    />
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="randomize_order" className="text-sm font-medium">
                            Acak Urutan Soal
                        </Label>
                        <Switch
                            id="randomize_order"
                            checked={formData.randomize_order}
                            onCheckedChange={(v) => handleSwitch("randomize_order", v)}
                            className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="shuffle_options" className="text-sm font-medium">
                            Acak Pilihan Jawaban
                        </Label>
                        <Switch
                            id="shuffle_options"
                            checked={formData.shuffle_options}
                            onCheckedChange={(v) => handleSwitch("shuffle_options", v)}
                            className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="is_public_results" className="text-sm font-medium">
                            Hasil Quiz Publik
                        </Label>
                        <Switch
                            id="is_public_results"
                            checked={formData.is_public_results}
                            onCheckedChange={(v) => handleSwitch("is_public_results", v)}
                            className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
                        />
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg shadow-md transition"
                    >
                    {loading ? "Membuat..." : "Buat Event"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    )
}
