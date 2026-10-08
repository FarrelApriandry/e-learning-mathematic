// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { fetchMe } from "../lib/authClient.js";

export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchMe().then((currentUser) => {
            if (!currentUser) {
                window.location.href = "/admin/";
            } else {
                setUser(currentUser);
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div class="text-center mt-10 text-gray-600">Checking auth...</div>;
    }

    return user ? children : null;
}
