// src/components/public/layout/Quiz/QuizJoin.jsx
import { useState } from "react";
import { Card, CardHeader, CardContent } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";

export default function QuizJoin({ quizType = "materi", quizId, kelas }) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) return setError("Isi namamu dulu sebelum mulai.");
        if (quizType === "event" && !code.trim()) return setError("Masukkan kode event yang kamu terima dari penyelenggara.");
        setError("");

        sessionStorage.setItem("quiz_username", name.trim());
        if (quizType === "event") sessionStorage.setItem("quiz_event_code", code.trim());

        window.location.href = `/quiz/kelas/${kelas}/${quizId}/start`;
    };

    const quizLabel = {
        materi: "Quiz Materi",
        global: "Quiz Global",
        event: "Quiz Event",
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
            <Card className="w-full max-w-sm border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                    </div>
                    <h1 className="mt-4 text-center text-xl font-extrabold tracking-tight text-slate-900">
                        {quizLabel[quizType]}
                    </h1>
                    <p className="mt-1 text-center text-sm text-slate-500">
                        {quizType === "event"
                            ? "Masukkan nama dan kode event untuk bergabung."
                            : "Masukkan namamu — hasil quiz tersimpan atas nama ini."}
                    </p>
                </CardHeader>
                <CardContent className="pt-4">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Nama</Label>
                            <Input
                                id="name"
                                className="mt-1.5"
                                placeholder="cth. Budi Santoso"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={60}
                            />
                        </div>

                        {quizType === "event" && (
                            <div>
                                <Label htmlFor="code" className="text-sm font-semibold text-slate-700">Kode event</Label>
                                <Input
                                    id="code"
                                    className="mt-1.5 tracking-widest"
                                    placeholder="6 digit angka"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    inputMode="numeric"
                                    maxLength={6}
                                />
                            </div>
                        )}

                        {error && (
                            <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-200">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700"
                        >
                            Mulai Quiz
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
