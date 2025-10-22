// src/components/ui/materi/MateriFormModal.jsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../dialog";
import { Input } from "../input";
import { Label } from "../label";
import { Button } from "../button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../select";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { BookPlus } from "lucide-react";
import { toast } from "../../../hooks/use-toast"

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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

  const selectedMateri =
    form.materiOption === "existing"
      ? form.materi
      : toTitleCase(form.materi);

  const payload = { ...form, materi: selectedMateri };
  delete payload.materiOption;

    try {
      const res = await fetch("/api/materi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Berhasil 🎉",
          description: "Materi berhasil dibuat!",
          variant: "default",
        });
        setTimeout(() => {
          setOpen(false);
          window.location.reload();
        }, 1200);
      } else {
        toast({
          title: "Gagal ❌",
          description: "Materi gagal dibuat!",
          variant: "destructive",
      });
      }
    } catch {
      toast({
        title: "Berhasil 🎉",
        description: "Event berhasil dibuat!",
        variant: "destructive",
    });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader className="border-b pb-3">
            <div className="flex items-center gap-2">
              <BookPlus className="w-5 h-5 text-indigo-600" />
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Tambah Materi Baru
              </DialogTitle>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-3">
            {/* Judul */}
            <div className="space-y-2">
              <Label htmlFor="title">Judul Materi</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Masukkan judul materi"
                required
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Masukkan deskripsi singkat"
                required
              />
            </div>

            {/* Kelas */}
            <div className="space-y-2">
              <Label>Kelas</Label>
              <Select
                value={form.class}
                onValueChange={(v) => setForm((prev) => ({ ...prev, class: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="11">11</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pilihan Materi */}
            <div className="space-y-2">
              <Label>Pilihan Materi</Label>
              <RadioGroup
                value={form.materiOption}
                onValueChange={(v) => setForm((prev) => ({ ...prev, materiOption: v }))}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new" className="font-normal text-gray-700">
                    Materi Baru
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing" id="existing" />
                  <Label htmlFor="existing" className="font-normal text-gray-700">
                    Materi Lama
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Materi Input / Dropdown */}
            {form.materiOption === "new" ? (
              <div className="space-y-2">
                <Label htmlFor="materi">Nama Materi</Label>
                <Input
                  id="materi"
                  name="materi"
                  value={form.materi}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      materi: toTitleCase(e.target.value),
                    }))
                  }
                  placeholder="Masukkan nama materi baru"
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="materi">Pilih Materi</Label>
                <Select
                  value={form.materi}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, materi: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih materi" />
                  </SelectTrigger>
                  <SelectContent>
                    {materiList.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* YouTube Link */}
            <div className="space-y-2">
              <Label htmlFor="youtube_link">Link YouTube</Label>
              <Input
                id="youtube_link"
                name="youtube_link"
                value={form.youtube_link}
                onChange={handleChange}
                placeholder="Masukkan link YouTube"
              />
            </div>

            {/* PDF Link */}
            <div className="space-y-2">
              <Label htmlFor="pdf_link">Link PDF</Label>
              <Input
                id="pdf_link"
                name="pdf_link"
                value={form.pdf_link}
                onChange={handleChange}
                placeholder="Masukkan link PDF"
              />
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan Materi"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
