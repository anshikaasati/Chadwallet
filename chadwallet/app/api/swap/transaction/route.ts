// app/api/swap/transaction/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SwapTransactionRequestSchema } from "@/types";
import { jupiter, privyService } from "@/services";
import { handleApiError, ApiError } from "@/lib/errors";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate the request via Privy JWT
    await privyService.getAuthFromRequest(request);

    const body = await request.json();
    const result = SwapTransactionRequestSchema.safeParse(body);

    if (!result.success) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "Invalid swap transaction request body.",
        422
      );
    }

    const txResponse = await jupiter.buildTransaction(result.data);
    return NextResponse.json({ data: txResponse });
  } catch (err) {
    return handleApiError(err);
  }
}
