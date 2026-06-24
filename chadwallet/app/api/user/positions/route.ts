// app/api/user/positions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PositionSchema } from "@/types";
import { supabaseService } from "@/services";
import { ApiError, handleApiError } from "@/lib/errors";
import { getAuthFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const auth = await getAuthFromRequest(request);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || auth.userId;

    if (auth.userId !== userId) {
      throw new ApiError(
        "FORBIDDEN",
        "Authenticated user ID does not match the requested user ID.",
        403
      );
    }

    const positions = await supabaseService.getUserPositions(userId);
    return NextResponse.json({ data: positions });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const auth = await getAuthFromRequest(request);

    const body = await request.json();
    const result = PositionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid user position details.",
            details: result.error.format(),
          },
        },
        { status: 400 }
      );
    }

    if (auth.userId !== result.data.userId) {
      throw new ApiError(
        "FORBIDDEN",
        "Authenticated user ID does not match the position user ID.",
        403
      );
    }

    const position = await supabaseService.upsertPosition(result.data);
    return NextResponse.json({ data: position });
  } catch (err) {
    return handleApiError(err);
  }
}
