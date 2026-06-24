// app/api/tokens/[address]/holders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { birdeye } from "@/services";
import { handleApiError, ApiError } from "@/lib/errors";

const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: { address: string } }
): Promise<NextResponse> {
  try {
    const address = params.address;
    if (!address || !BASE58_REGEX.test(address)) {
      throw new ApiError(
        "INVALID_ADDRESS",
        "Token address parameter is missing or invalid base58.",
        422
      );
    }
    const holders = await birdeye.getTopHolders(address);
    return NextResponse.json({ data: holders });
  } catch (err) {
    return handleApiError(err);
  }
}
export const revalidate = 60; // 60s ISR cache
