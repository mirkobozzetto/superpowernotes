import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface RemainingCreditsProps {
  remainingTime: number | null;
  fetchRemainingTime: () => Promise<void>;
}

export const RemainingCredits: React.FC<RemainingCreditsProps> = ({
  remainingTime,
  fetchRemainingTime,
}) => {
  const { data: session } = useSession();

  useEffect(() => {
    fetchRemainingTime();
  }, [fetchRemainingTime]);

  if (remainingTime === null || session?.user?.role === "ADMIN") {
    return null;
  }

  return (
    <div className="fixed bottom-2 left-0 right-0 flex justify-center pb-4">
      <p className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full border border-gray-300/20 inline-block">
        Remaining time credits: {Math.floor(remainingTime / 60)}m {remainingTime % 60}s
      </p>
    </div>
  );
};
