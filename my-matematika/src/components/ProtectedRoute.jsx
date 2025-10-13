// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "preact/hooks";
import { auth, onAuthStateChanged } from "../lib/firebaseConfig";

export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (!currentUser) {
            window.location.href = "/admin/login";
        } else {
            setUser(currentUser);
        }
        setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div class="text-center mt-10 text-gray-600">Checking auth...</div>;
    }

    return user ? children : null;
}
