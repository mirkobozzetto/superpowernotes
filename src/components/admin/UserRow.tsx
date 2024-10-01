import { User, UserRole } from "@prisma/client";
import React from "react";
import { UserDetails } from "./UserDetails";

interface UserRowProps {
  user: User;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  toggleExpand: (userId: string) => void;
  isExpanded: boolean;
}

export const UserRow: React.FC<UserRowProps> = ({ user, updateUser, toggleExpand, isExpanded }) => {
  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 truncate">{user.name || "N/A"}</td>
        <td className="px-6 py-4 truncate">{user.email}</td>
        <td className="px-6 py-4">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.emailVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {user.emailVerified ? "Yes" : "No"}
          </span>
        </td>
        <td className="px-6 py-4">
          <select
            value={user.role}
            onChange={(e) => updateUser(user.id, { role: e.target.value as UserRole })}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {Object.values(UserRole).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </td>
        <td className="px-6 py-4">
          <button
            onClick={() => toggleExpand(user.id)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            {isExpanded ? "Hide Details" : "Show Details"}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={5}>
            <UserDetails user={user} />
          </td>
        </tr>
      )}
    </>
  );
};
