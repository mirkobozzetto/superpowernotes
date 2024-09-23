interface Props {
  isPaused: boolean;
  onClick: () => void;
}

export const PauseResumeButton = ({ isPaused, onClick }: Props) => {
  return (
    <button onClick={onClick} className="px-4 py-2 border rounded transition-colors">
      {isPaused ? "Resume" : "Pause"}
    </button>
  );
};
