// app/api/swap/quote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { QuoteRequestSchema } from "@/types";
import { jupiter, privyService } from "@/services";
import { handleApiError, ApiError } from "@/lib/errors";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate the request via Privy JWT
    await privyService.getAuthFromRequest(request);

    const body = await request.json();
    const result = QuoteRequestSchema.safeParse(body);
    
    if (!result.success) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "Invalid swap quote query parameters.",
        422
      );
    }

    const quote = await jupiter.getQuote(result.data);
    return NextResponse.json({ data: quote });
  } catch (err) {
    return handleApiError(err);
  }
}
