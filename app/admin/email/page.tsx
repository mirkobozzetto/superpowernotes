"use client";

import { Card } from "@chadcn/components/ui/card";
import { EmailSender } from "@src/components/admin/utils/EmailSender";

export default function EmailPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl">Email Management</h1>

      <div className="gap-6 grid">
        <EmailSender selectedUsers={undefined} />

        <Card className="p-6">
          <h2 className="mb-4 font-bold text-xl">Email Stats</h2>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-600 text-sm">Total Subscribers</div>
              <div className="font-bold text-2xl">-</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-600 text-sm">Emails Sent (30d)</div>
              <div className="font-bold text-2xl">-</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-600 text-sm">Delivery Rate</div>
              <div className="font-bold text-2xl">-</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
