// app/api/tokens/[address]/trades/route.ts
import { NextRequest, NextResponse } from "next/server";
import { birdeye } from "@/services";
import { handleApiError } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
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
    const trades = await birdeye.getRecentTrades(address);
    return NextResponse.json({ data: trades });
  } catch (err) {
    return handleApiError(err);
  }
}
export const dynamic = "force-dynamic";
