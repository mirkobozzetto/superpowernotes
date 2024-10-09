"use client";
import { User, UserRole } from "@prisma/client";
import { UserRow } from "@src/components/admin/UserRow";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [modifiedUsers, setModifiedUsers] = useState<Set<string>>(new Set());
  const [activeRole, setActiveRole] = useState<UserRole | "ALL">("ALL");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  const updateUser = async (userId: string, data: Partial<User>) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update user: ${response.status} ${errorText}`);
      }

      const updatedUser = await response.json();
      setUsers(users.map((user) => (user.id === userId ? { ...user, ...updatedUser } : user)));
      setModifiedUsers(new Set(modifiedUsers).add(userId));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const toggleExpand = (userId: string) => {
    setExpandedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const saveAllChanges = async () => {
    for (const userId of Array.from(modifiedUsers)) {
      const user = users.find((u) => u.id === userId);
      if (user) {
        await updateUser(userId, user);
      }
    }
    setModifiedUsers(new Set());
    router.refresh();
  };

  const filteredUsers =
    activeRole === "ALL" ? users : users.filter((user) => user.role === activeRole);

  return (
    <div className="mx-auto p-4 max-w-full">
      <h1 className="mb-6 font-bold text-2xl md:text-3xl">User Management</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {["ALL", ...Object.values(UserRole)].map((role) => (
          <button
            key={role}
            onClick={() => setActiveRole(role as UserRole | "ALL")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeRole === role ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Name",
                "Email",
                "Role",
                "Time Limit",
                "Used Time",
                "Remaining Time",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 font-medium text-gray-500 text-left text-xs uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                updateUser={updateUser}
                toggleExpand={() => toggleExpand(user.id)}
                isExpanded={expandedUsers.has(user.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {modifiedUsers.size > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={saveAllChanges}
            className="bg-blue-500 hover:bg-blue-700 shadow-lg px-4 py-2 rounded-full font-bold text-white transform transition duration-300 ease-in-out hover:scale-105"
          >
            Save Changes ({modifiedUsers.size})
          </button>
        </div>
      )}
    </div>
  );
}
