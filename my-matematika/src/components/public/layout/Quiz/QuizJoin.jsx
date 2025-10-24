// src/components/public/layout/Quiz/QuizJoin.jsx
import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import { LogIn, KeyRound } from "lucide-react";

export default function QuizJoin({ quizType = "materi", quizId, kelas }) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) return alert("Masukkan nama dulu ya!");
        if (quizType === "event" && !code.trim()) return alert("Masukkan kode event dulu!");

        sessionStorage.setItem("quiz_username", name);
        if (quizType === "event") sessionStorage.setItem("quiz_event_code", code);

        window.location.href = `/quiz/kelas/${kelas}/${quizId}/start`;
    };

    const quizLabel = {
        materi: "Kuis Materi",
        global: "Kuis Global",
        event: "Kuis Event",
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950">
            <Card className="w-[350px] shadow-lg border border-slate-300 dark:border-slate-800">
                <CardHeader>
                    <h2 className="text-xl font-semibold text-center flex items-center justify-center gap-2">
                        <LogIn className="w-5 h-5 text-primary" /> {quizLabel[quizType]}
                    </h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <Label className="text-sm text-indigo-400" htmlFor="name">Masukkan Namamu</Label>
                            <Input
                                id="name"
                                className="rounded-lg"
                                placeholder="Masukkan nama kamu"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {quizType === "event" && (
                            <div>
                                <Label htmlFor="code" className="flex items-center gap-1">
                                    <KeyRound className="w-4 h-4 text-primary" /> Event Code
                                </Label>
                                <Input
                                    id="code"
                                    placeholder="Masukkan kode event"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-2 bg-gradient-to-r text-white from-blue-600 to-indigo-600 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                        >
                            Join Now
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="text-xs text-slate-300 text-center text-muted-foreground">
                    {quizType === "event"
                        ? "Gunakan kode unik dari penyelenggara event."
                        : "Langsung mulai kuis tanpa kode."}
                </CardFooter>
            </Card>
        </div>
    );
}
