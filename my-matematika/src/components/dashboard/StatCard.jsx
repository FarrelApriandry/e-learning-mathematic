import { BookOpen, FileQuestion, Users, ClipboardList } from "lucide-react";

const icons = {
  book: BookOpen,
  quiz: FileQuestion,
  users: Users,
  participants: ClipboardList,
};

// Kartu putih + ikon dalam kotak warna lembut (konsisten dgn gaya publik)
export default function StatCard({ title, value, icon, tint }) {
  const Icon = icons[icon];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-4">
        {Icon && (
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tint ?? "bg-indigo-50 text-indigo-600"}`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div>
          <p className="text-2xl font-extrabold tracking-tight text-slate-900">{value}</p>
          <p className="text-sm font-medium text-slate-500">{title}</p>
        </div>
      </div>
    </div>
  );
}
