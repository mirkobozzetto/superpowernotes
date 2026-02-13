import type { User } from "@generated/prisma/client";
import { useAdminUser } from "@src/hooks/admin/useAdminUser";
import { useSession } from "next-auth/react";
import React from "react";

type UserRowProps = {
  user: User;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  toggleExpand: () => void;
  isExpanded: boolean;
};

export const UserRow: React.FC<UserRowProps> = ({
  user,
  updateUser,
  deleteUser,
  toggleExpand,
  isExpanded,
}) => {
  const { role, timeInfo, handleRoleChange, resetRemainingTime, formatTime } = useAdminUser(
    user,
    isExpanded,
    updateUser
  );

  const { data: session } = useSession();
  const isCurrentUser = session?.user?.email === user.email;

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
            className="block border-gray-300 focus:border-indigo-500 bg-white shadow-sm border rounded-md focus:ring-indigo-500 w-full focus:outline-none sm:text-sm"
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
          <button onClick={toggleExpand} className="mr-2 text-blue-600 hover:text-blue-900">
            {isExpanded ? "Hide Details" : "Show Details"}
          </button>
          <button
            onClick={resetRemainingTime}
            className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-white"
          >
            Reset Time
          </button>
          {!isCurrentUser && (
            <button
              onClick={() => deleteUser(user.id)}
              className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-white"
            >
              Delete
            </button>
          )}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={7} className="bg-gray-50 px-4 py-2">
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
