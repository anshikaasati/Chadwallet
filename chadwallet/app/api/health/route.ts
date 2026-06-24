// app/api/health/route.ts
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";

export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
