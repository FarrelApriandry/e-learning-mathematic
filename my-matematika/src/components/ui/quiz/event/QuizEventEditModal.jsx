import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../dialog";
import { Input } from "../../input";
import { Label } from "../../label";
import { Button } from "../../button";
import { Textarea } from "../../textarea";
import { Switch } from "../../switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../select";
import { toast } from "../../../../hooks/use-toast";
import { auth } from "src/lib/firebaseConfig";

export default function QuizEventEditModal({ isOpen, onClose, event, onUpdate }) {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (event) {
        setFormData({
            title: event.title || "",
            description: event.description || "",
            category: event.category || "",
            duration_minutes: event.duration_minutes || "",
            start_time: event.start_time
            ? new Date(event.start_time.seconds * 1000)
                .toISOString()
                .slice(0, 16)
            : "",
            end_time: event.end_time
            ? new Date(event.end_time.seconds * 1000)
                .toISOString()
                .slice(0, 16)
            : "",
            randomize_order: event.randomize_order ?? false,
            shuffle_options: event.shuffle_options ?? false,
            is_public_results: event.is_public_results ?? true,
            max_participants: event.max_participants || "",
        });
        }
    }, [event]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwitch = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
        const user = auth.currentUser;

        const payload = {
            id: event.id,
            updates: {
            ...formData,
            start_time: formData.start_time
                ? new Date(formData.start_time)
                : null,
            end_time: formData.end_time
                ? new Date(formData.end_time)
                : null,
            },
            last_modified_by: user ? user.email || user.uid : "unknown",
        };

        const res = await fetch("/api/quiz_event", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Gagal memperbarui event.");
        const data = await res.json();

        toast({
            title: "Berhasil ✅",
            description: "Event berhasil diperbarui.",
        });

        onUpdate?.({ id: event.id, ...formData });
        onClose();
        } catch (err) {
        console.error("❌ PUT error:", err);
        toast({
            title: "Gagal ❌",
            description: "Terjadi kesalahan saat memperbarui event.",
            variant: "destructive",
        });
        } finally {
        setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg bg-white text-gray-800 shadow-2xl border border-gray-200 rounded-2xl p-6">
            <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-amber-700">
                ✏️ Edit Quiz Event
            </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
                <Label htmlFor="title">Judul Event</Label>
                <Input
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                required
                />
            </div>

            <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                />
            </div>

            <div>
                <Label htmlFor="category">Kategori</Label>
                <Select
                onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, category: v }))
                }
                className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                value={formData.category || ""}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Umum">Umum</SelectItem>
                    <SelectItem value="Teknologi">Teknologi</SelectItem>
                    <SelectItem value="Sejarah">Sejarah</SelectItem>
                    <SelectItem value="Budaya">Budaya</SelectItem>
                </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                <Label htmlFor="duration_minutes">Durasi (menit)</Label>
                <Input
                    type="number"
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
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    className="bg-gray-50 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                />
                </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
                {/* <div className="flex items-center justify-between">
                <Label>Acak Urutan Soal</Label>
                <Switch
                    checked={formData.randomize_order}
                    onCheckedChange={(v) => handleSwitch("randomize_order", v)}
                />
                </div>
                <div className="flex items-center justify-between">
                <Label>Acak Pilihan Jawaban</Label>
                <Switch
                    checked={formData.shuffle_options}
                    onCheckedChange={(v) => handleSwitch("shuffle_options", v)}
                />
                </div>
                <div className="flex items-center justify-between">
                <Label>Hasil Quiz Publik</Label>
                <Switch
                    checked={formData.is_public_results}
                    onCheckedChange={(v) => handleSwitch("is_public_results", v)}
                />
                </div> */}
                <div className="flex items-center justify-between">
                    <Label htmlFor="randomize_order" className="text-sm font-medium">
                        Acak Urutan Soal
                    </Label>
                    <Switch
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
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded-lg shadow-md transition"
                >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
            </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    );
}
