import { Badge } from "@chadcn/components/ui/badge";
import { Button } from "@chadcn/components/ui/button";
import { Card } from "@chadcn/components/ui/card";
import { useState } from "react";

type EmailResult = {
  email: string;
  success: boolean;
  error: string | null;
};

export function EmailSender({ selectedUsers }: { selectedUsers?: string[] }) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<EmailResult[]>([]);

  const handleSend = async (type: "subscribers" | "specific") => {
    if (!subject || !content) {
      alert("Please fill in both subject and content");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          userIds: selectedUsers,
          template: {
            subject,
            content,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setResults(data.result);
      setSubject("");
      setContent("");
    } catch (error) {
      console.error("Failed to send emails:", error);
      alert("Failed to send emails. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="space-y-4 p-6">
      <h2 className="font-bold text-xl">Send Emails</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-sm">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="Email subject"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="p-2 border rounded w-full h-32"
            placeholder="Email content"
          />
        </div>

        <div className="flex space-x-4">
          <Button onClick={() => handleSend("subscribers")} disabled={sending}>
            Send to All Subscribers
          </Button>

          {selectedUsers && (
            <Button
              onClick={() => handleSend("specific")}
              disabled={sending || selectedUsers.length === 0}
            >
              Send to Selected Users ({selectedUsers.length})
            </Button>
          )}
        </div>

        {results.length > 0 && (
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
        )}
      </div>
    </Card>
  );
}
