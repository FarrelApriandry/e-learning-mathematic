import { useEffect, useState } from "react";
import { fetchQuizGlobal } from "../../../../lib/apiClient.js";
import { Card, CardHeader, CardContent, CardFooter } from "../../card";
import { Button } from "../../button";
import { Users } from "lucide-react";

export default function QuizListCard({ onSelectQuiz }) {
    const [quizList, setQuizList] = useState([]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await fetchQuizGlobal();
                setQuizList(data);
            } catch (err) {
                console.error("Gagal memuat quiz global:", err);
            }
        };
        fetchQuiz();
    }, []);

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizList.map((quiz) => (
                <Card key={quiz.id} className="shadow-lg border border-slate-200 hover:shadow-xl transition">
                <CardHeader>
                    <h2 className="font-semibold text-lg text-indigo-700">{quiz.title}</h2>
                </CardHeader>
                <CardContent className="text-slate-600">
                    <p className="text-sm mb-2 line-clamp-2">{quiz.description}</p>
                    <p className="text-xs">Total Soal: {quiz.questions?.length || 0}</p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 hover:text-gray-200" onClick={() => onSelectQuiz(quiz)}>
                        <Users className="w-4 h-4 mr-2" /> Lihat Participants
                    </Button>
                </CardFooter>
                </Card>
            ))}
        </div>
    );
}
