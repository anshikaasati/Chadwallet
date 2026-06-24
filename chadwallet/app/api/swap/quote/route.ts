// app/api/swap/quote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { QuoteRequestSchema } from "@/types";
import { jupiter } from "@/services";
import { handleApiError } from "@/lib/errors";
import { getAuthFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate the request via Privy JWT
    await getAuthFromRequest(request);

    const body = await request.json();
    const result = QuoteRequestSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid swap quote query parameters.",
            details: result.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const quote = await jupiter.getQuote(result.data);
    return NextResponse.json({ data: quote });
  } catch (err) {
    return handleApiError(err);
  }
}
