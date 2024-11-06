import { User, UserRole } from "@prisma/client";
import { userService } from "@src/services/userService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [modifiedUsers, setModifiedUsers] = useState<Set<string>>(new Set());
  const [activeRole, setActiveRole] = useState<UserRole | "ALL">("ALL");
  const router = useRouter();

  useEffect(() => {
    userService.fetchAllUsers().then(setUsers);
  }, []);

  const updateUser = async (userId: string, data: Partial<User>) => {
    try {
      const updatedUser = await userService.updateUserData(userId, data);
      setUsers(users.map((user) => (user.id === userId ? { ...user, ...updatedUser } : user)));
      setModifiedUsers(new Set(modifiedUsers).add(userId));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const toggleExpand = (userId: string) => {
    setExpandedUsers((prev) => {
      const newSet = new Set(prev);
      newSet.has(userId) ? newSet.delete(userId) : newSet.add(userId);
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

  const deleteUser = async (userId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredUsers =
    activeRole === "ALL" ? users : users.filter((user) => user.role === activeRole);

  return {
    users: filteredUsers,
    expandedUsers,
    modifiedUsers,
    activeRole,
    updateUser,
    toggleExpand,
    saveAllChanges,
    setActiveRole,
    deleteUser,
  };
}
