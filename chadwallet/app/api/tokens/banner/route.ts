// app/api/tokens/banner/route.ts
import { NextResponse } from "next/server";
import { birdeye } from "@/services";
import { handleApiError } from "@/lib/errors";

export async function GET(): Promise<NextResponse> {
  try {
    const tokens = await birdeye.getBannerTokens();
    return NextResponse.json({ data: tokens });
  } catch (err) {
    return handleApiError(err);
  }
}
export const revalidate = 15; // 15s ISR cache
