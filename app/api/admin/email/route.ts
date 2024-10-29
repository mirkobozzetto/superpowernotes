import { auth } from "@src/lib/auth/auth";
import { emailService } from "@src/services/emailService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userIds, template, type } = body;

    let result;

    if (type === "subscribers") {
      result = await emailService.sendToSubscribers(template);
    } else if (type === "specific" && userIds) {
      result = await emailService.sendToSpecificUsers(userIds, template);
    } else {
      return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
  }
}
