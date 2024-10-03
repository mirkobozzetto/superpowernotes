import { User, UserRole } from "@prisma/client";
import { useEffect, useState } from "react";

interface TimeInfo {
  totalUsedTime: number;
  remainingTime: number;
}

export const useAdminUser = (user: User, isExpanded: boolean) => {
  const [role, setRole] = useState<UserRole>(user.role);
  const [timeInfo, setTimeInfo] = useState<TimeInfo>({
    totalUsedTime: 0,
    remainingTime: user.timeLimit,
  });
  const TIME_LIMIT = 1800;

  useEffect(() => {
    const fetchTotalUsedTime = async () => {
      if (!isExpanded) return;
      try {
        const response = await fetch(`/api/users/${user.id}/total-used-time`);
        if (response.ok) {
          const data = await response.json();
          const usedTime = data.totalUsedTime || 0;
          setTimeInfo({
            totalUsedTime: usedTime,
            remainingTime: Math.max(0, TIME_LIMIT - usedTime),
          });
        }
      } catch (error) {
        console.error("Error fetching total used time:", error);
      }
    };

    fetchTotalUsedTime();
  }, [user.id, isExpanded]);

  const handleRoleChange = async (newRole: UserRole) => {
    setRole(newRole);
    await updateUser({ role: newRole });
  };

  const resetRemainingTime = async () => {
    const newTimeLimit = TIME_LIMIT;
    setTimeInfo((prev) => ({ ...prev, remainingTime: newTimeLimit }));
    await updateUser({ timeLimit: newTimeLimit });
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update user");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const formatTime = (seconds: number) => {
    if (typeof seconds !== "number" || isNaN(seconds)) {
      return "0m 0s";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return {
    role,
    timeInfo,
    handleRoleChange,
    resetRemainingTime,
    formatTime,
    TIME_LIMIT,
  };
};
