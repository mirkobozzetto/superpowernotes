"use client";
import { User, UserRole } from "@prisma/client";
import { UserRow } from "@src/components/admin/UserRow";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [modifiedUsers, setModifiedUsers] = useState<Set<string>>(new Set());
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

  const renderUserSection = (title: string, filteredUsers: User[]) => (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Email", "Email Verified", "Role", "Monthly Limit", "Used", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
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
    </section>
  );

  return (
    <div className="p-6 max-w-full mx-auto">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      <div className="space-y-12">
        {renderUserSection(
          "Admins",
          users.filter((user) => user.role === UserRole.ADMIN)
        )}
        {renderUserSection(
          "Regular Users",
          users.filter((user) => user.role === UserRole.USER)
        )}
        {renderUserSection(
          "Beta Users",
          users.filter((user) => user.role === UserRole.BETA)
        )}
      </div>
      {modifiedUsers.size > 0 && (
        <div className="mt-8">
          <button
            onClick={saveAllChanges}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save All Changes ({modifiedUsers.size})
          </button>
        </div>
      )}
    </div>
  );
}
