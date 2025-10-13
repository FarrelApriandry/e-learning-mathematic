import { BookOpen, FileQuestion, Users } from "lucide-react";

const icons = {
    book: BookOpen,
    quiz: FileQuestion,
    users: Users,
    };

    export default function StatCard({ title, value, icon, color }) {
    const Icon = icons[icon];

    return (
        <div className={`p-6 rounded-2xl shadow-md text-white ${color}`}>
        <div className="flex items-center justify-between">
            <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
            </div>
            {Icon && <Icon size={28} />}
        </div>
        </div>
    );
}
