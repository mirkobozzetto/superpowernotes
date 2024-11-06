"use client";

import { Card } from "@chadcn/components/ui/card";
import { useAdminEmail } from "@src/hooks/admin/useAdminEmail";
import { EmailActions, EmailInput, EmailResults } from "./_EmailSender/EmailSenderAssets";

export const EmailSender = ({ selectedUsers }: { selectedUsers?: string[] }) => {
  const {
    subject,
    title,
    content,
    sending,
    results,
    setSubject,
    setTitle,
    setContent,
    handleSend,
  } = useAdminEmail(selectedUsers);

  return (
    <Card className="space-y-4 bg-white p-6">
      <h2 className="font-bold text-xl">Send Emails</h2>

      <div className="space-y-4">
        <EmailInput
          value={subject}
          onChange={setSubject}
          label="Email Subject"
          placeholder="Subject line in email clients"
        />

        <EmailInput
          value={title}
          onChange={setTitle}
          label="Title"
          placeholder="Title in email body"
        />

        <EmailInput
          value={content}
          onChange={setContent}
          label="Content"
          placeholder="Email content"
          isTextArea
        />

        <EmailActions
          onSendToSubscribers={() => handleSend("subscribers")}
          onSendToSelected={selectedUsers ? () => handleSend("specific") : undefined}
          selectedUsersCount={selectedUsers?.length}
          disabled={sending}
        />

        <EmailResults results={results} />
      </div>
    </Card>
  );
};
