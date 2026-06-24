// app/api/tokens/[address]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { birdeye } from "@/services";
import { handleApiError } from "@/lib/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
): Promise<NextResponse> {
  try {
    const address = params.address;
    if (!address) {
      return NextResponse.json(
        { error: { code: "INVALID_ADDRESS", message: "Token address parameter is missing." } },
        { status: 400 }
      );
    }
    const overview = await birdeye.getTokenOverview(address);
    return NextResponse.json({ data: overview });
  } catch (err) {
    return handleApiError(err);
  }
}
export const revalidate = 60; // 60s ISR cache
