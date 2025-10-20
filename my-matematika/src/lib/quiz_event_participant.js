// src/lib/quiz_event_participant.js
import {
    db,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
} from "./firebaseConfig";
import { onSnapshot } from "firebase/firestore";

/**
 * 👤Validate Event Status (by data)
 * - Memvalidasi status dari event berdasarkan data
 */
function validateEventStatus(eventData) {
    const now = new Date();
    const start = eventData.start_time?.toDate?.() ?? new Date(0);
    const end = eventData.end_time?.toDate?.() ?? new Date(9999, 0, 1);

    if (now < start) throw new Error("Event belum dimulai");
    if (now > end || eventData.status === "closed")
        throw new Error("Event sudah berakhir");
}


/**
 * 🧩 Join quiz event
 * - Menambahkan user ke array participants di event
 */
export async function joinEvent(eventId, uid) {
    if (!eventId || !uid) throw new Error("eventId dan uid wajib diisi!");

    const ref = doc(db, "quiz_event", eventId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Event tidak ditemukan");

    const eventData = snap.data();
    validateEventStatus(eventData)
    const participants = eventData.participants || [];

    if (participants.some((p) => p.uid === uid))
        return { success: false, message: "Kamu sudah join event ini" };

    const newParticipant = {
        uid,
        answers: [],
        score: 0,
        completed_at: null,
        joined_at: new Date().toISOString(),
    };

    await updateDoc(ref, {
        participants: arrayUnion(newParticipant),
        updated_at: serverTimestamp(),
    });

    return { success: true, message: "Berhasil join event!", participant: newParticipant };
}


/**
 * ✍️ Submit answers
 * - Mengupdate jawaban dan nilai akhir peserta
 */
export async function submitAnswers(eventId, uid, answers, score) {
    if (!eventId || !uid) throw new Error("eventId dan uid wajib diisi!");
    const ref = doc(db, "quiz_event", eventId);
    const snap = await getDoc(ref);

    if (!snap.exists()) throw new Error("Event tidak ditemukan");

    const eventData = snap.data();
    validateEventStatus(eventData)
    const participants = eventData.participants || [];

    const updatedParticipants = participants.map((p) =>
        p.uid === uid
        ? {
            ...p,
            answers: answers || [],
            score: score || 0,
            completed_at: new Date().toISOString(),
        }
        : p
    );

    await updateDoc(ref, {
        participants: updatedParticipants,
        updated_at: serverTimestamp(),
    });

    const allCompleted = updatedParticipants.every(p => p.completed_at);
    if (allCompleted && eventData.status !== "closed") {
        await updateDoc(ref, { status: "closed" });
    }


    return { success: true, message: "Jawaban berhasil disubmit!", score };
}

/**
 * 👤 Get participant data (by user)
 * - Mengambil data peserta berdasarkan UID
 */
export async function getParticipant(eventId, uid) {
    if (!eventId || !uid) throw new Error("eventId dan uid wajib diisi!");
    const ref = doc(db, "quiz_event", eventId);
    const snap = await getDoc(ref);

    if (!snap.exists()) throw new Error("Event tidak ditemukan");
    const eventData = snap.data();

    return (eventData.participants || []).find((p) => p.uid === uid) || null;
}

/**
 * 📜 Get all participants (if public result)
 * - Hanya boleh dipanggil kalau `is_public_results === true`
 */
export async function getAllParticipants(eventId) {
    if (!eventId) throw new Error("eventId wajib diisi!");
    const ref = doc(db, "quiz_event", eventId);
    const snap = await getDoc(ref);

    if (!snap.exists()) throw new Error("Event tidak ditemukan");
    const eventData = snap.data();

    if (!eventData.is_public_results)
        throw new Error("Hasil tidak bersifat publik");

    return eventData.participants || [];
}

/**
 * 🧾 Get user result
 * - Mengambil hasil quiz user dari event tertentu
 */
export async function getUserResult(eventId, uid) {
    const participant = await getParticipant(eventId, uid);
    if (!participant) throw new Error("Kamu belum mengikuti event ini");

    return {
        score: participant.score,
        completed_at: participant.completed_at,
        answers: participant.answers,
    };
}

/**
 * 🚪 Leave quiz event
 * - Menghapus user dari daftar peserta (opsional)
 */
export async function leaveEvent(eventId, uid) {
    if (!eventId || !uid) throw new Error("eventId dan uid wajib diisi!");
    const ref = doc(db, "quiz_event", eventId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Event tidak ditemukan");

    const eventData = snap.data();
    const participant = (eventData.participants || []).find((p) => p.uid === uid);
    if (!participant) throw new Error("Kamu belum tergabung di event ini");

    await updateDoc(ref, {
        participants: arrayRemove(participant),
        updated_at: serverTimestamp(),
    });

    return { success: true, message: "Berhasil keluar dari event!" };
}

export function listenParticipants(eventId, callback) {
    const ref = doc(db, "quiz_event", eventId);
    return onSnapshot(ref, (snap) => {
        if (snap.exists()) callback(snap.data().participants || []);
    });
}

export async function getLeaderboard(eventId) {
    const ref = doc(db, "quiz_event", eventId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Event tidak ditemukan");

    const participants = snap.data().participants || [];
    return participants
        .filter(p => typeof p.score === "number")
        .sort((a, b) => b.score - a.score)
        .map((p, i) => ({ rank: i + 1, ...p }));
}  