import type { User } from "@generated/prisma/client";
import React from "react";

type UserDetailsProps = {
  user: User;
};

const formatDate = (date: Date | string | null) => {
  if (!date) return "N/A";
  if (typeof date === "string") {
    return date.split("T")[0];
  }
  return date.toISOString().split("T")[0];
};

export const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="mb-2 font-medium text-lg">Additional Details for {user.name || user.email}</h3>
      <p>Created At: {formatDate(user.createdAt)}</p>
      <p>Updated At: {formatDate(user.updatedAt)}</p>
    </div>
  );
};
