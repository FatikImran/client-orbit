import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "Client Orbit Support AI",
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}
