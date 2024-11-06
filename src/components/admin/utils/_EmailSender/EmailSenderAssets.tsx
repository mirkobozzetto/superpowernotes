import { Badge } from "@chadcn/components/ui/badge";
import { Button } from "@chadcn/components/ui/button";

type EmailInputProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  isTextArea?: boolean;
};

export const EmailInput = ({
  value,
  onChange,
  label,
  placeholder,
  isTextArea,
}: EmailInputProps) => (
  <div>
    <label className="block mb-1 font-medium text-sm">{label}</label>
    {isTextArea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border rounded w-full h-32"
        placeholder={placeholder}
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border rounded-full w-full"
        placeholder={placeholder}
      />
    )}
  </div>
);

type EmailActionsProps = {
  onSendToSubscribers: () => void;
  onSendToSelected?: () => void;
  selectedUsersCount?: number;
  disabled: boolean;
};

export const EmailActions = ({
  onSendToSubscribers,
  onSendToSelected,
  selectedUsersCount,
  disabled,
}: EmailActionsProps) => (
  <div className="flex space-x-4">
    <Button onClick={onSendToSubscribers} disabled={disabled}>
      Send to All Subscribers
    </Button>

    {onSendToSelected && selectedUsersCount !== undefined && (
      <Button onClick={onSendToSelected} disabled={disabled || selectedUsersCount === 0}>
        Send to Selected Users ({selectedUsersCount})
      </Button>
    )}
  </div>
);

type EmailResultsProps = {
  results: {
    email: string;
    success: boolean;
    error: string | null;
  }[];
};

export const EmailResults = ({ results }: EmailResultsProps) => {
  if (results.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="mb-2 font-medium">Results:</h3>
      <div className="space-y-2">
        {results.map((result, i) => (
          <div key={i} className="flex items-center space-x-2">
            <span>{result.email}</span>
            <Badge variant={result.success ? "default" : "destructive"}>
              {result.success ? "Sent" : "Failed"}
            </Badge>
            {result.error && <span className="text-red-500 text-sm">{result.error}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
