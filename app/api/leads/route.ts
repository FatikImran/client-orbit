import { NextRequest, NextResponse } from "next/server";
import { getRecentLeads, saveLead } from "@/lib/db/queries";
import { leadCaptureSchema } from "@/lib/utils/validation";

function isAuthorized(request: NextRequest) {
  const incoming = request.headers.get("x-admin-token");
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    return true;
  }
  return incoming === token;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await getRecentLeads(25);
  return NextResponse.json({ leads }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = leadCaptureSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lead payload" }, { status: 400 });
  }

  const record = await saveLead({
    sessionId: "manual-entry",
    ...parsed.data
  });

  return NextResponse.json({ lead: record }, { status: 201 });
}
