// app/api/tokens/[address]/price/route.ts
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
        { error: { code: "INVALID_ADDRESS", message: "Token address is required." } },
        { status: 400 }
      );
    }
    const { searchParams } = new URL(request.url);
    const resolution = searchParams.get("resolution") || "1D";
    const from = parseInt(searchParams.get("from") || "0", 10);
    const to = parseInt(searchParams.get("to") || "0", 10);

    const bars = await birdeye.getOHLCV(address, resolution, from, to);
    return NextResponse.json({ data: bars });
  } catch (err) {
    return handleApiError(err);
  }
}
export const revalidate = 15; // 15s ISR cache
