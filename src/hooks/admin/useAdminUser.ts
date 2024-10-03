import { User, UserRole } from "@prisma/client";
import { useEffect, useState } from "react";

interface TimeInfo {
  totalUsedTime: number;
  remainingTime: number;
}

export const useAdminUser = (
  user: User,
  isExpanded: boolean,
  updateUser: (userId: string, data: Partial<User>) => Promise<void>
) => {
  const [role, setRole] = useState<UserRole>(user.role);
  const [timeInfo, setTimeInfo] = useState<TimeInfo>({
    totalUsedTime: user.currentPeriodUsedTime,
    remainingTime: user.currentPeriodRemainingTime,
  });

  useEffect(() => {
    const fetchCurrentUsage = async () => {
      if (!isExpanded) return;
      try {
        const response = await fetch(`/api/users/${user.id}/usage`);
        if (response.ok) {
          const data = await response.json();
          setTimeInfo({
            totalUsedTime: data.currentPeriodUsedTime,
            remainingTime: data.currentPeriodRemainingTime,
          });
          // Mettez à jour d'autres champs si nécessaire
        }
      } catch (error) {
        console.error("Error fetching current usage:", error);
      }
    };

    fetchCurrentUsage();
  }, [user.id, isExpanded]);

  const handleRoleChange = async (newRole: UserRole) => {
    setRole(newRole);
    await updateUser(user.id, { role: newRole });
  };

  const resetRemainingTime = async () => {
    const newTimeLimit = user.timeLimit;
    setTimeInfo({ totalUsedTime: 0, remainingTime: newTimeLimit });
    await updateUser(user.id, {
      currentPeriodRemainingTime: newTimeLimit,
      currentPeriodUsedTime: 0,
      lastResetDate: new Date(),
    });
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
  };
};
