// app/api/tokens/[address]/price/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { birdeye } from "@/services";
import { handleApiError } from "@/lib/errors";

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
    if (!address) {
      return NextResponse.json(
        { error: { code: "INVALID_ADDRESS", message: "Token address is required." } },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const parsedParams = PriceQueryParamsSchema.safeParse({
      resolution: searchParams.get("resolution"),
      from: searchParams.get("from"),
      to: searchParams.get("to"),
    });

    if (!parsedParams.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid price query parameters.",
            details: parsedParams.error.format(),
          },
        },
        { status: 400 }
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
