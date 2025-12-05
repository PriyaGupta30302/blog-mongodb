"use client";

import { useEffect, useState } from "react";

const AdminProfileIcon = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("adminInfo");
    if (!stored) return;

    try {
      setAdmin(JSON.parse(stored));
    } catch (err) {
      console.error("Failed to parse adminInfo", err);
    }
  }, []);

  // If we don't have email yet, show a default circle
  if (!admin?.email) {
    return (
      <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
        A
      </div>
    );
  }

  // Generate a unique avatar URL based on email (Dicebear)
  const avatarUrl = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(
    admin.email
  )}`;

  return (
    <img
      src={avatarUrl}
      alt={admin.email}
      className="w-9 h-9 rounded-full object-cover"
    />
  );
};

export default AdminProfileIcon;
