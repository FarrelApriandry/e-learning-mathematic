import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../lib/firebaseConfig";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "../../table";
import { Button } from "../../button";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function ParticipantsTable({ quiz, onBack }) {
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        const fetchParticipants = async () => {
        const snap = await getDocs(collection(db, "quiz_global", quiz.id, "participants"));
        setParticipants(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };
        fetchParticipants();
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
            <Button variant="outline" onClick={() => window.location.reload()}>
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
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{(p.score / p.total) * 100}</TableCell>
                            <TableCell>{p.total}</TableCell>
                            <TableCell>{p.score}</TableCell>
                            <TableCell>{new Date(p.createdAt.seconds * 1000).toLocaleString()}</TableCell>
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
