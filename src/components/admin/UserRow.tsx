import { User } from "@prisma/client";
import React, { useEffect, useState } from "react";

interface UserRowProps {
  user: User;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  toggleExpand: () => void;
  isExpanded: boolean;
}

export const UserRow: React.FC<UserRowProps> = ({ user, updateUser, toggleExpand, isExpanded }) => {
  const [role, setRole] = useState(user.role);
  const [totalUsedTime, setTotalUsedTime] = useState(0);

  useEffect(() => {
    const fetchTotalUsedTime = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}/total-used-time`);
        if (response.ok) {
          const data = await response.json();
          setTotalUsedTime(data.totalUsedTime || 0);
        }
      } catch (error) {
        console.error("Error fetching total used time:", error);
      }
    };

    if (isExpanded) {
      fetchTotalUsedTime();
    }
  }, [user.id, isExpanded]);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole as User["role"]);
    updateUser(user.id, { role: newRole as User["role"] });
  };

  const formatTime = (seconds: number) => {
    if (typeof seconds !== "number" || isNaN(seconds)) {
      return "0m 0s";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const timeLimit = typeof user.timeLimit === "number" ? user.timeLimit : 1800; // Default to 1800 if not set
  const remainingTime = Math.max(0, timeLimit - totalUsedTime);

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-2 whitespace-nowrap">{user.name || "N/A"}</td>
        <td className="px-4 py-2 whitespace-nowrap">{user.email}</td>
        <td className="px-4 py-2 whitespace-nowrap">
          <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="BETA">Beta</option>
          </select>
        </td>
        <td className="px-4 py-2 whitespace-nowrap">
          <button onClick={toggleExpand} className="text-blue-600 hover:text-blue-900">
            {isExpanded ? "Hide Details" : "Show Details"}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={4} className="px-4 py-2 bg-gray-50">
            <div className="text-sm">
              <p>
                <strong>Email Verified:</strong> {user.emailVerified ? "Yes" : "No"}
              </p>
              <p>
                <strong>Time Limit:</strong> {formatTime(timeLimit)}
              </p>
              <p>
                <strong>Total Used Time:</strong> {formatTime(totalUsedTime)}
              </p>
              <p>
                <strong>Remaining Time:</strong> {formatTime(remainingTime)}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}
              </p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
