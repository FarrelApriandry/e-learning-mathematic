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
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
          <p className="text-center text-sm text-slate-400">Memeriksa sesi admin...</p>
        </div>
      </div>
    );
  }

  return user ? children : null;
}
