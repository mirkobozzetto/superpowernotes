import { User } from "@prisma/client";
import { useAdminUser } from "@src/hooks/admin/useAdminUser";
import React from "react";

interface UserRowProps {
  user: User;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  toggleExpand: () => void;
  isExpanded: boolean;
}

export const UserRow: React.FC<UserRowProps> = ({ user, updateUser, toggleExpand, isExpanded }) => {
  const { role, timeInfo, handleRoleChange, resetRemainingTime, formatTime } = useAdminUser(
    user,
    isExpanded,
    updateUser
  );

  const formatDate = (dateValue: Date | string | null | undefined) => {
    if (!dateValue) return "Not set";
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  };

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-2 whitespace-nowrap">{user.name || "N/A"}</td>
        <td className="px-4 py-2 whitespace-nowrap">{user.email}</td>
        <td className="px-4 py-2 whitespace-nowrap">
          <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value as User["role"])}
            className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="BETA">Beta</option>
          </select>
        </td>
        <td className="px-4 py-2 whitespace-nowrap">{formatTime(user.timeLimit)}</td>
        <td className="px-4 py-2 whitespace-nowrap">{formatTime(timeInfo.totalUsedTime)}</td>
        <td className="px-4 py-2 whitespace-nowrap">{formatTime(timeInfo.remainingTime)}</td>
        <td className="px-4 py-2 whitespace-nowrap">
          <button onClick={toggleExpand} className="text-blue-600 hover:text-blue-900 mr-2">
            {isExpanded ? "Hide Details" : "Show Details"}
          </button>
          <button
            onClick={resetRemainingTime}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reset Time
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={7} className="px-4 py-2 bg-gray-50">
            <div className="text-sm">
              <p>
                <strong>Email Verified:</strong>{" "}
                {user.emailVerified ? formatDate(user.emailVerified) : "No"}
              </p>
              <p>
                <strong>Last Reset Date:</strong> {formatDate(user.lastResetDate)}
              </p>
              <p>
                <strong>Created At:</strong> {formatDate(user.createdAt)}
              </p>
              <p>
                <strong>Updated At:</strong> {formatDate(user.updatedAt)}
              </p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
