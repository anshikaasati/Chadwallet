// app/api/tokens/trending/route.ts
import { NextResponse } from "next/server";
import { birdeye } from "@/services";
import { handleApiError } from "@/lib/errors";

export async function GET(): Promise<NextResponse> {
  try {
    const tokens = await birdeye.getTrendingTokens();
    return NextResponse.json({ data: tokens });
  } catch (err) {
    return handleApiError(err);
  }
}
export const revalidate = 30; // 30s ISR cache
