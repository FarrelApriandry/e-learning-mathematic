// src/components/public/layout/Quiz/QuizStart.jsx
import { useEffect, useState } from "react";
import { Button } from "../../../ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "../../../ui/card";
import { Progress } from "../../../ui/progress";
import { motion } from "framer-motion";
import { fetchQuizMateri, submitQuizResult } from "../../../../lib/apiClient.js";
import { EmptyState } from "../cards.jsx";

let BlockMath;
import("react-katex").then((mod) => {
    BlockMath = mod.BlockMath || mod.default?.BlockMath;
});
import "katex/dist/katex.min.css";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function QuizStart({ quizId, kelas }) {
    const [quiz, setQuiz] = useState(null);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [finished, setFinished] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    useEffect(() => {
        const load = async () => {
        try {
            const data = await fetchQuizMateri({ id: quizId });
            if (data) setQuiz(data);
        } catch (err) {
            console.error("Error fetch quiz:", err);
        } finally {
            setLoading(false);
        }
        };

        load();
    }, [quizId]);

    useEffect(() => {
        if (!finished || saving) return;
        const q = quiz?.questions || [];
        const answerArr = q.map((_, i) => answers[i] ?? -1);
        const username = sessionStorage.getItem("quiz_username") || "Anon";
        setSaving(true);
        // Skor dihitung server-side (kunci jawaban tidak pernah ke browser).
        submitQuizResult("materi", quizId, username, answerArr, 0, q.length)
            .catch((err) => {
                console.error("Error saving participant result:", err);
                setSaveError("Hasil gagal tersimpan — periksa koneksi, lalu muat ulang halaman.");
            })
            .finally(() => setSaving(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finished]);

    if (loading) {
        return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md animate-pulse rounded-2xl border border-slate-200 bg-white p-6" aria-hidden="true">
            <div className="mx-auto h-4 w-32 rounded bg-slate-200" />
            <div className="mx-auto mt-3 h-2 w-full rounded-full bg-slate-200" />
            <div className="mt-6 space-y-3">
                <div className="h-5 rounded bg-slate-200" />
                {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-xl bg-slate-100" />
                ))}
            </div>
            </div>
        </div>
        );
    }

    if (!quiz) {
        return (
        <div className="mx-auto max-w-2xl px-4 py-16">
            <EmptyState
            title="Quiz tidak ditemukan"
            hint="Tautan quiz ini sudah tidak tersedia atau sudah dihapus."
            actionHref={`/quiz/kelas/${kelas}/`}
            actionLabel="Kembali ke daftar quiz"
            />
        </div>
        );
    }

    const questions = quiz.questions || [];
    const total = questions.length;
    const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

    const handleSelect = (qIndex, optionIndex) => {
        setAnswers({ ...answers, [qIndex]: optionIndex });
    };

    const handleNext = () => {
        if (current < total - 1) setCurrent(current + 1);
        else setFinished(true);
    };

    const handleBack = () => {
        if (current > 0) setCurrent(current - 1);
    };

    if (finished) {
        const answerArr = questions.map((_, i) => answers[i] ?? -1);
        const answered = answerArr.filter((a) => a >= 0).length;
        const username = sessionStorage.getItem("quiz_username") || "Anon";

        return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
            <motion.div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">Quiz selesai</h2>
            <p className="mt-1 text-sm text-slate-500">{username} &bull; {quiz.title}</p>
            <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-5 ring-1 ring-inset ring-slate-200">
                <div className="text-4xl font-extrabold text-slate-900">{answered}<span className="text-lg font-bold text-slate-400">/{total}</span></div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">soal terjawab</div>
            </div>
            {saving && <p className="mt-4 text-sm text-slate-500">Menyimpan hasil...</p>}
            {saveError && (
                <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-200">
                {saveError}
                </p>
            )}
            <Button
                disabled={saving}
                onClick={() => (window.location.href = `/quiz/kelas/${kelas}/`)}
                className="mt-6 w-full bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700"
            >
                Kembali ke Daftar Quiz
            </Button>
            </motion.div>
        </div>
        );
    }

    const q = questions[current];

    // Deteksi ekspresi LaTeX
    const isMath = (text) => typeof text === "string" && /\\\\|{|}|_|\^/.test(text);

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto w-full max-w-xl">
            <div className="flex items-center justify-between gap-4">
            <a href={`/quiz/kelas/${kelas}/`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                Daftar quiz
            </a>
            <div className="text-sm font-bold text-slate-700">
                Soal {current + 1} <span className="font-medium text-slate-400">dari {total}</span>
            </div>
            </div>

            <Progress value={progress} className="mt-3 h-1.5" />

            <motion.div
            key={current}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            >
            <Card className="mt-5 border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">{quiz.title}</h2>
                </CardHeader>
                <CardContent>
                <div className="text-lg font-semibold text-slate-900 leading-relaxed">
                    {isMath(q.question) && BlockMath ? (
                    <BlockMath math={q.question} strict="ignore" />
                    ) : (
                    <p>{q.question}</p>
                    )}
                </div>

                <div className="mt-5 flex flex-col gap-2.5" role="radiogroup" aria-label={`Pilihan jawaban soal ${current + 1}`}>
                    {(q.options || []).map((opt, i) => {
                    const selected = answers[current] === i;
                    return (
                        <button
                        key={i}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => handleSelect(current, i)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                            selected
                            ? "border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                        >
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${
                            selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                        }`}>
                            {OPTION_LETTERS[i] || i + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                            {isMath(opt) && BlockMath ? <BlockMath math={opt} strict="ignore" /> : opt}
                        </span>
                        </button>
                    );
                    })}
                </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={current === 0}
                    className="text-slate-600 disabled:opacity-40"
                >
                    Kembali
                </Button>
                <Button
                    onClick={handleNext}
                    className="bg-indigo-600 font-semibold text-white hover:bg-indigo-700"
                >
                    {current < total - 1 ? "Soal Berikutnya" : "Selesaikan Quiz"}
                </Button>
                </CardFooter>
            </Card>
            </motion.div>
        </div>
        </div>
    );
}
