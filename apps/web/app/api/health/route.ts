import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "nexusplay-web",
    timestamp: new Date().toISOString(),
  });
}
