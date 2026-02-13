import type { User, UserRole } from "@prisma/client";
import { useEffect, useState } from "react";
import { z } from "zod";

const UserUsageSchema = z.object({
  currentPeriodUsedTime: z.number(),
  currentPeriodRemainingTime: z.number(),
});

type TimeInfo = {
  totalUsedTime: number;
  remainingTime: number;
};

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUsage = async () => {
      if (!isExpanded) return;
      try {
        const response = await fetch(`/api/users/${user.id}/usage`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData = await response.json();
        const data = UserUsageSchema.parse(rawData);

        setTimeInfo({
          totalUsedTime: data.currentPeriodUsedTime,
          remainingTime: data.currentPeriodRemainingTime,
        });
        setError(null);
      } catch (error) {
        console.error("Error fetching current usage:", error);
        setError("Failed to fetch usage data");
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
