// src/components/layout/quiz/event/QuizEventQuestionPage.jsx
import { useEffect, useState } from "react"
import {CircleArrowLeft} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../../../ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "../../../ui/card"
import { Badge } from "../../../ui/badge"
import QuizEventQuestionFormModal from "../../../ui/quiz/event/QuizEventQuestionFormModal"

export default function QuizEventQuestionPage({ eventId, onBack }) {
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchQuestions = async () => {
        setLoading(true)
        const res = await fetch(`/api/quiz_event_question?eventId=${eventId}`)
        const data = await res.json()
        setQuestions(data.data || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchQuestions()
    }, [eventId])

    const convertAnswer = (index) => {
        const map = ["A", "B", "C", "D"]
        return map[index] || "?"
    }

    function truncateText(text, maxLength = 50) {
        if (!text) return "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    }

    return (
        <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
            <Button
            variant="outline"
            className="border-blue-400 text-blue-400 hover:text-blue-500 hover:bg-slate-100 hover:border-blue-500"
            onClick={onBack}
            >
                <CircleArrowLeft size={14}/>
            </Button>

            <Button
            id="btnTambah"
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white hover:bg-blue-700 shadow-md"
            >
            + Tambah Soal
            </Button>
        </div>

        {/* Content */}
        {loading ? (
            <p className="text-gray-400 animate-pulse text-center">Memuat data...</p>
        ) : questions.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
            <AnimatePresence>
                {questions.map((q, i) => (
                <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                >
                    <Card className=" border border-slate-700 hover:border-green-500 hover:bg-green-100 transition-colors duration-200 shadow-lg">
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-slate-800">
                        {i + 1}. {truncateText(q.question, 40)}
                        </h3>
                    </CardHeader>

                    <CardContent className="space-y-2">
                        {q.options?.map((opt, idx) => {
                            const isCorrect = idx === q.answer;
                            return (
                            <div
                                key={idx}
                                className={`p-2 rounded-lg border text-sm ${
                                isCorrect
                                    ? "border-green-400 bg-green-100 text-green-700"
                                    : "border-gray-300 bg-white"
                                }`}
                            >
                                <span className="font-bold mr-2">{convertAnswer(idx)}.</span>
                                {truncateText(opt, 40)}
                            </div>
                            );
                        })}
                    </CardContent>

                    <CardFooter className="flex justify-between items-center text-sm text-green-600">
                        <span>
                        Jawaban Benar:{" "}
                        <Badge variant="outline" className="text-green-600 border-green-300">
                            {convertAnswer(q.answer)}
                        </Badge>
                        </span>
                    </CardFooter>
                    </Card>
                </motion.div>
                ))}
            </AnimatePresence>
            </div>
        ) : (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 rounded-lg border"
            >
            <p className="text-slate-700 text-lg font-medium">
                Belum ada soal di event ini.
            </p>
            <Button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsModalOpen(true)}
            >
                Tambahkan Soal Pertama
            </Button>
            </motion.div>
        )}

        {/* Modal */}
        <QuizEventQuestionFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            eventId={eventId}
            onCreated={fetchQuestions}
        />
        </div>
    )
}
