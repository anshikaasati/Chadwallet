// app/api/tokens/[address]/price/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { birdeye } from "@/services";
import { handleApiError, ApiError } from "@/lib/errors";

const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

const PriceQueryParamsSchema = z.object({
  resolution: z.enum(["1", "5", "15", "60", "240", "1D", "1W"]),
  from: z.coerce.number().int().positive(),
  to: z.coerce.number().int().positive(),
});

export async function GET(
  request: NextRequest,
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

    const { searchParams } = new URL(request.url);
    const parsedParams = PriceQueryParamsSchema.safeParse({
      resolution: searchParams.get("resolution"),
      from: searchParams.get("from"),
      to: searchParams.get("to"),
    });

    if (!parsedParams.success) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "Invalid price query parameters.",
        422
      );
    }

    const { resolution, from, to } = parsedParams.data;
    const bars = await birdeye.getOHLCV(address, resolution, from, to);
    return NextResponse.json({ data: bars });
  } catch (err) {
    return handleApiError(err);
  }
}
export const revalidate = 15; // 15s ISR cache
