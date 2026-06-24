// app/api/user/upsert/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AppUserSchema } from "@/types";
import { supabaseService, privyService } from "@/services";
import { ApiError, handleApiError } from "@/lib/errors";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const auth = await privyService.getAuthFromRequest(request);

    const body = await request.json();
    const result = AppUserSchema.safeParse(body);

    if (!result.success) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "Invalid user payload.",
        422
      );
    }

    if (auth.userId !== result.data.id) {
      throw new ApiError(
        "FORBIDDEN",
        "Authenticated user ID does not match the requested profile ID.",
        403
      );
    }

    const user = await supabaseService.upsertUser(result.data);
    return NextResponse.json({ data: user });
  } catch (err) {
    return handleApiError(err);
  }
}
