export const fetchRemainingTimeForUser = async (userId: string): Promise<number> => {
  const response = await fetch(`/api/users/${userId}/usage`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.currentPeriodRemainingTime;
};
