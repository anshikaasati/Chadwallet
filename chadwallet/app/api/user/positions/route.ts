// app/api/user/positions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PositionSchema } from "@/types";
import { supabaseService } from "@/services";
import { handleApiError } from "@/lib/errors";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: { code: "INVALID_USER", message: "userId parameter is required." } },
        { status: 400 }
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

    const position = await supabaseService.upsertPosition(result.data);
    return NextResponse.json({ data: position });
  } catch (err) {
    return handleApiError(err);
  }
}
