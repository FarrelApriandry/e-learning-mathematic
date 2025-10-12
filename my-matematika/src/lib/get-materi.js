// src/lib/getMateri.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function getMateri() {
    const querySnapshot = await getDocs(collection(db, "materi"));
    const materiList = [];

    querySnapshot.forEach((doc) => {
        materiList.push({
        id: doc.id,
        ...doc.data(),
        });
    });

    return materiList;
}
