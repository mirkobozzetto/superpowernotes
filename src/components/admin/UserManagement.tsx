"use client";

import { Button } from "@chadcn/components/ui/button";
import { Card } from "@chadcn/components/ui/card";
import type { User, UserRole } from "@generated/prisma/client";
import { useUserManagement } from "@src/hooks/admin/useUserManagement";
import { UserRow } from "./_UserManagement/UserRow";

type RoleFilterProps = {
  activeRole: UserRole | "ALL";
  onRoleChange: (role: UserRole | "ALL") => void;
};

type UserTableProps = {
  users: User[];
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  expandedUsers: Set<string>;
  toggleExpand: (userId: string) => void;
};

function RoleFilter({ activeRole, onRoleChange }: RoleFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {["ALL", "ADMIN", "USER", "BETA"].map((role) => (
        <Button
          key={role}
          variant={activeRole === role ? "default" : "secondary"}
          onClick={() => onRoleChange(role as UserRole | "ALL")}
          size="sm"
        >
          {role}
        </Button>
      ))}
    </div>
  );
}

function UserTable({ users, updateUser, deleteUser, expandedUsers, toggleExpand }: UserTableProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {["Name", "Email", "Role", "Time Limit", "Used Time", "Remaining Time", "Actions"].map(
              (header) => (
                <th
                  key={header}
                  className="px-4 py-2 font-medium text-gray-500 text-left text-xs uppercase tracking-wider"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              updateUser={updateUser}
              deleteUser={deleteUser}
              toggleExpand={() => toggleExpand(user.id)}
              isExpanded={expandedUsers.has(user.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UserManagement() {
  const {
    users,
    expandedUsers,
    modifiedUsers,
    activeRole,
    updateUser,
    deleteUser,
    toggleExpand,
    saveAllChanges,
    setActiveRole,
  } = useUserManagement();

  return (
    <Card className="border-0 mx-auto p-4 max-w-full">
      <h1 className="mb-6 font-bold text-2xl md:text-3xl">Account Management</h1>
      <RoleFilter activeRole={activeRole} onRoleChange={setActiveRole} />
      <UserTable
        users={users}
        updateUser={updateUser}
        deleteUser={deleteUser}
        expandedUsers={expandedUsers}
        toggleExpand={toggleExpand}
      />
      {modifiedUsers.size > 0 && (
        <div className="flex justify-center mt-6">
          <Button onClick={saveAllChanges} className="transform transition hover:scale-105">
            Save Changes ({modifiedUsers.size})
          </Button>
        </div>
      )}
    </Card>
  );
}
