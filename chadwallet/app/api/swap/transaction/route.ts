// app/api/swap/transaction/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SwapTransactionRequestSchema } from "@/types";
import { jupiter } from "@/services";
import { handleApiError } from "@/lib/errors";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const result = SwapTransactionRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid swap transaction request body.",
            details: result.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const txResponse = await jupiter.assembleTransaction(result.data);
    return NextResponse.json({ data: txResponse });
  } catch (err) {
    return handleApiError(err);
  }
}
