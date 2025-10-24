// src\components\public\layout\Quiz\QuizStart.jsx
import { useEffect, useState } from "react";
import { db } from "../../../../lib/firebaseConfig";
import { Button } from "../../../ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "../../../ui/card";
import { Progress } from "../../../ui/progress";
import { Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function QuizStart({ quizId, kelas }) {
    const [quiz, setQuiz] = useState(null);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [finished, setFinished] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const ref = doc(db, "quiz_materi", quizId);
                const snap = await getDoc(ref);
                if (snap.exists()) setQuiz(snap.data());
            } catch (err) {
                console.error("Error fetch quiz:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-indigo-600">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-lg font-semibold animate-pulse">Menyiapkan Quiz...</p>
            </div>
        );
    }

    if (!quiz) {
        return (
            <p className="text-center mt-20 text-red-500 font-semibold text-lg">
                Quiz tidak ditemukan 😢
            </p>
        );
    }

    const questions = quiz.questions || [];
    const total = questions.length;
    const progress = ((current + 1) / total) * 100;

    const handleSelect = (qIndex, optionIndex) => {
        setAnswers({ ...answers, [qIndex]: optionIndex });
    };

    const saveParticipantResult = async (quizId, name, score, total) => {
        try {
            const quizRef = doc(db, "quiz_materi", quizId);
            const participantsRef = collection(quizRef, "participants");
    
            await addDoc(participantsRef, {
                name,
                score,
                total,
                createdAt: serverTimestamp(),
            });
    
            console.log("✅ Participant result saved!");
        } catch (err) {
            console.error("❌ Error saving participant result:", err);
        }
    };

    // setSaving(true);
    //     await saveParticipantResult(quizId, username, score, total);
    // setSaving(false)
    

    const handleNext = () => {
        if (current < total - 1) {
            setCurrent(current + 1);
        } else {
            setFinished(true);
        }
    };

    if (finished) {
        const score = questions.reduce(
            (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
            0
        );
        const username = sessionStorage.getItem("quiz_username") || "Anon";

        saveParticipantResult(quizId, username, score, total);

        return (
            <motion.div
                className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-b from-indigo-100 to-purple-200 dark:from-slate-900 dark:to-indigo-950"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.div
                    className="bg-white dark:bg-slate-900 shadow-2xl rounded-2xl p-10 w-[90%] sm:w-[400px]"
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 120 }}
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="text-indigo-500 w-6 h-6" />
                        <h2 className="text-3xl font-bold text-indigo-700">Quiz Selesai 🎉</h2>
                    </div>
                    <p className="text-lg font-medium mb-2">{username}</p>
                    <p className="text-xl mb-6">
                        Skor kamu:
                        <span className="ml-2 font-bold text-indigo-600">
                            {score}/{total}
                        </span>
                    </p>
                    <Button
                        disabled={saving}
                        onClick={() => (window.location.href = `/quiz/kelas/${kelas}`)}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-[1.03] transition-transform duration-200"
                    >
                        {saving ? "Menyimpan hasil..." : "Kembali ke Daftar Quiz"}
                    </Button>
                </motion.div>
            </motion.div>
        );
    }

    const q = questions[current];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 dark:from-slate-900 dark:to-indigo-950 px-4">
            <motion.div
                key={current}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="w-full sm:w-[450px]"
            >
                <Card className="p-6 rounded-2xl shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-indigo-200 dark:border-slate-800">
                    <CardHeader className="text-center mb-2">
                        <h2 className="text-xl font-bold text-indigo-700 mb-2">
                            Soal {current + 1} dari {total}
                        </h2>
                        <Progress value={progress} className="h-2 rounded-full" />
                    </CardHeader>

                    <CardContent>
                        <p className="mb-6 text-slate-700 dark:text-slate-300 font-medium text-lg text-center">
                            {q.question}
                        </p>
                        <div className="flex flex-col gap-3">
                            {q.options.map((opt, i) => {
                                const selected = answers[current] === i;
                                return (
                                    <motion.button
                                        key={i}
                                        whileTap={{ scale: 0.97 }}
                                        className={`w-full text-left px-4 py-3 rounded-xl font-medium border transition-all duration-200 
                                            ${
                                                selected
                                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                                                    : "border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                            }`}
                                        onClick={() => handleSelect(current, i)}
                                    >
                                        {opt}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end mt-6">
                        <Button
                            onClick={handleNext}
                            className="rounded bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow hover:shadow-lg hover:scale-[1.03] transition-transform"
                        >
                            {current < total - 1 ? "Selanjutnya →" : "Selesai ✅"}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
