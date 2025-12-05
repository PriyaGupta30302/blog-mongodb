"use client";
import React, { useEffect, useState } from "react";

const SubscriptionPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch admin users
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch("/api/admin/getAdmins");
        const data = await res.json();
        setAdmins(data);
      } catch (err) {
        console.error("Failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const handleDelete = async (id) => {
    const ok = confirm("Are you sure you want to delete this admin?");
    if (!ok) return;

    const prev = admins;
    setAdmins(admins.filter((u) => u._id !== id));

    try {
      const res = await fetch(`/api/admin/deleteAdmin?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
    } catch (err) {
      alert("Delete failed");
      setAdmins(prev);
    }
  };

  const formatDateFromObjectId = (id) =>
    new Date(parseInt(id.substring(0, 8), 16) * 1000).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  return (
    <div className="p-6">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4">
        Subscription / Admin List
      </h1>

      <div className="bg-white rounded shadow border w-full overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Full Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Registered</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="text-center py-5 text-gray-500">
                  Loading admins...
                </td>
              </tr>
            )}

            {!loading && admins.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-5 text-gray-500">
                  No admins found
                </td>
              </tr>
            )}

            {admins.map((admin) => (
              <tr key={admin._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  {admin.firstName} {admin.lastName}
                </td>
                <td className="px-4 py-3">{admin.email}</td>
                <td className="px-4 py-3">
                  {formatDateFromObjectId(admin._id)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(admin._id)}
                    className="px-3 py-1 text-red-600 hover:bg-red-100 rounded-md"
                  >
                    Delete ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionPage;
