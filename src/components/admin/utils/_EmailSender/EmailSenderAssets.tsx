import { Badge } from "@chadcn/components/ui/badge";
import { Button } from "@chadcn/components/ui/button";
import { useState } from "react";

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

type EmailRecipientsConfig = {
  includeSubscribers: boolean;
  includeUsers: boolean;
};

type EmailActionsProps = {
  onSend: (config: EmailRecipientsConfig) => void;
  selectedUsersCount?: number;
  disabled: boolean;
};

export const EmailActions = ({ onSend, selectedUsersCount, disabled }: EmailActionsProps) => {
  const [includeSubscribers, setIncludeSubscribers] = useState(false);
  const [includeUsers, setIncludeUsers] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeSubscribers}
            onChange={(e) => setIncludeSubscribers(e.target.checked)}
            className="border-gray-300 rounded"
          />
          <span>Newsletter Subscribers</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeUsers}
            onChange={(e) => setIncludeUsers(e.target.checked)}
            className="border-gray-300 rounded"
          />
          <span>Subscribed Users</span>
        </label>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => onSend({ includeSubscribers, includeUsers })}
          disabled={disabled || (!includeSubscribers && !includeUsers)}
        >
          Send Email
        </Button>

        {selectedUsersCount !== undefined && (
          <Button
            onClick={() => onSend({ includeSubscribers: false, includeUsers: true })}
            disabled={disabled || selectedUsersCount === 0}
          >
            Send to Selected Users ({selectedUsersCount})
          </Button>
        )}
      </div>
    </div>
  );
};

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
