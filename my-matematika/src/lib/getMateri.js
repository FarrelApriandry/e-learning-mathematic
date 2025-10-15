// // src/lib/getMateri.js
// // Client-side helper (uses firebase client SDK)
// import {
//     collection,
//     query,
//     getDocs,
//     orderBy,
//     limit as limitQ,
//     startAfter,
//   } from "firebase/firestore";
//   import { db } from "./firebaseConfig";
  
//   /**
//    * Fetch materi (client-side)
//    * @param {Object} options
//    * @param {string} options.orderByField - field to sort by (default: 'created_at')
//    * @param {'asc'|'desc'} options.order - sort order
//    * @param {number} options.limit - max documents to fetch (default: 50)
//    * @param {any} options.startAfterDoc - Firestore DocumentSnapshot to paginate (optional)
//    */
  export async function getMateri() {
    try {
      const baseUrl = import.meta.env.PUBLIC_BASE_URL || "";
      const res = await fetch(`${baseUrl}/api/getMateri`, { cache: "no-store" });
      const json = await res.json();
      if (json.success) return json.data;
      return [];
    } catch (err) {
      console.error("Error fetching materi:", err);
      return [];
    }
  }
  
  export default getMateri;
  