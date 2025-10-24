import { useState } from "react";
import QuizListCard from "../../../ui/quiz/event/QuizListCard";
import ParticipantsTable from "../../../ui/quiz/event/ParticipantsTable";

export default function QuizParticipantsPage() {
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    const handleSelectQuiz = (quiz) => {
        setSelectedQuiz(quiz);
    };

    return (
        <div className="p-6">
            {!selectedQuiz ? (
                <QuizListCard onSelectQuiz={handleSelectQuiz} />
            ) : (
                <ParticipantsTable quiz={selectedQuiz} onBack={() => setSelectedQuiz(null)} />
            )}
        </div>
    );
}
