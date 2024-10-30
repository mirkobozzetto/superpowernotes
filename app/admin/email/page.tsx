"use client";

import { Card } from "@chadcn/components/ui/card";
import { EmailSender } from "@src/components/admin/utils/EmailSender";

export default function EmailPage() {
  return (
    <div className="space-y-6">
      <Card className="border-0 mx-auto p-4 max-w-full">
        <h1 className="mb-6 font-bold text-2xl md:text-3xl">Email Management</h1>

        <div className="gap-6 grid">
          <EmailSender selectedUsers={undefined} />

          <Card className="bg-white p-6">
            <h2 className="mb-4 font-bold text-xl">Email Stats</h2>
            <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
              <div className="border-gray-200 p-4 border rounded-lg">
                <div className="text-gray-600 text-sm">Total Subscribers</div>
                <div className="font-bold text-2xl">-</div>
              </div>
              <div className="border-gray-200 p-4 border rounded-lg">
                <div className="text-gray-600 text-sm">Emails Sent (30d)</div>
                <div className="font-bold text-2xl">-</div>
              </div>
              <div className="border-gray-200 p-4 border rounded-lg">
                <div className="text-gray-600 text-sm">Delivery Rate</div>
                <div className="font-bold text-2xl">-</div>
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}
