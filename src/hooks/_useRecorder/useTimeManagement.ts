import { useTimeManagementStore } from "@src/stores/timeManagementStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const useTimeManagement = () => {
  const { data: session } = useSession();
  const {
    remainingTime,
    recordingTime,
    setRecordingTime,
    fetchRemainingTime,
    updateRemainingTime,
  } = useTimeManagementStore();

  useEffect(() => {
    if (session?.user?.id) {
      fetchRemainingTime(session.user.id);
    }
  }, [session, fetchRemainingTime]);

  return {
    remainingTime,
    recordingTime,
    setRecordingTime,
    updateRemainingTime,
    fetchRemainingTime,
  };
};
