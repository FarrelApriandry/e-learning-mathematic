import { useEffect, useState } from "react";
import { fetchParticipants } from "../../../../lib/apiClient.js";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "../../table";
import { Button } from "../../button";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function ParticipantsTable({ quiz, onBack }) {
    const [participants, setParticipants] = useState([]);

    const loadParticipants = async () => {
        try {
            const data = await fetchParticipants("materi", quiz.id);
            setParticipants(data);
        } catch (err) {
            console.error("Gagal memuat peserta:", err);
        }
    };

    useEffect(() => {
        loadParticipants();
    }, [quiz.id]);

    return (
        <div>
        <div className="flex justify-between items-center mb-4">
            <div>
            <h2 className="text-xl font-semibold text-indigo-700">{quiz.title}</h2>
            <p className="text-slate-500 text-sm">Daftar peserta kuis ini</p>
            </div>
            <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Button>
            <Button variant="outline" onClick={loadParticipants}>
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
            </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Nilai Akhir</TableHead>
                    <TableHead>Total Soal</TableHead>
                    <TableHead>Skor</TableHead>
                    <TableHead>Tanggal</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {participants.length > 0 ? (
                    participants.map((p, i) => (
                        <TableRow key={p.id}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{p.name || p.uid || "-"}</TableCell>
                            <TableCell>{p.total > 0 ? Math.round((p.score / p.total) * 100) : 0}</TableCell>
                            <TableCell>{p.total}</TableCell>
                            <TableCell>{p.score}</TableCell>
                            <TableCell>{p.joined_at ? new Date(p.joined_at).toLocaleString() : "-"}</TableCell>
                        </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-400 py-4">
                    Belum ada peserta.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        </div>
    );
}
