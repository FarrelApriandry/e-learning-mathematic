// src/components/ui/materi/MateriEditDialog.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../dialog";
import { Button } from "../button";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { BookOpen, ExternalLink, FileText, X, Save } from "lucide-react";
import { toast } from "../../../hooks/use-toast";

export default function MateriEditDialog({ isOpen, onClose, materi, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    class: "",
    description: "",
    youtube_link: "",
    pdf_link: "",
  });

  useEffect(() => {
    if (materi) {
      setFormData({
        title: materi.title || "",
        class: materi.class || "",
        description: materi.description || "",
        youtube_link: materi.youtube_link || "",
        pdf_link: materi.pdf_link || "",
      });
    }
  }, [materi]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/materi", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: materi.id, ...formData }),
      });

      const result = await res.json();
      if (result.success) {
        toast({ title: "Materi berhasil diperbarui!" });
        onSave?.(formData);
        onClose();
      } else {
        toast({
          title: `Gagal memperbarui: ${result.message}`,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Update error:", err);
      toast({
        title: "Terjadi kesalahan saat menyimpan data.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
        {/* HEADER */}
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            Edit Materi: {formData.title}
          </DialogTitle>
          <p className="text-slate-500 text-sm mt-1">
            Ubah informasi materi dan isi kontennya di sini.
        </p>
        </DialogHeader>
        {/* <button onClick={onClose}>
            <X size={24} className="text-white hover:text-slate-200" />
        </button> */}

        {/* CONTENT */}
        <form
          onSubmit={handleSubmit}
          className=""
        >
          {/* JUDUL & KELAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Judul Materi"
              name="title"
              value={formData.title}
              onChange={handleChange}
              icon={<BookOpen size={16} />}
            />
            <FormField
              label="Kelas"
              name="class"
              value={formData.class}
              onChange={handleChange}
              icon={<BookOpen size={16} />}
            />
          </div>

          {/* DESKRIPSI */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Deskripsi
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tulis deskripsi materi..."
              className="mt-2 bg-slate-50/70 border border-slate-300 rounded-xl resize-none"
              rows={4}
            />
          </div>

          {/* LINK SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Link YouTube"
              name="youtube_link"
              value={formData.youtube_link}
              onChange={handleChange}
              icon={<ExternalLink size={16} />}
            />
            <FormField
              label="Link PDF"
              name="pdf_link"
              value={formData.pdf_link}
              onChange={handleChange}
              icon={<FileText size={16} />}
            />
          </div>

          {/* FOOTER */}
          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2"
            >
              <Save size={18} /> Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FormField({ label, name, value, onChange, icon }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-2.5 text-slate-400">{icon}</span>
        <Input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="pl-9 bg-slate-50/70 border border-slate-300 rounded-xl"
        />
      </div>
    </div>
  );
}
