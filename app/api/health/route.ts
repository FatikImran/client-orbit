import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "UpTicket AI Support Assistant",
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}
