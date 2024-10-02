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
    fetch("/api/admin/users")
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
    <div className="p-4 max-w-full mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">User Management</h1>

      <div className="mb-4 flex flex-wrap gap-2">
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

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Email", "Role", "Actions"].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
        <div className="mt-6 flex justify-center">
          <button
            onClick={saveAllChanges}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Save Changes ({modifiedUsers.size})
          </button>
        </div>
      )}
    </div>
  );
}
