// app/api/user/upsert/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AppUserSchema } from "@/types";
import { supabaseService } from "@/services";
import { handleApiError } from "@/lib/errors";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const result = AppUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid user payload.",
            details: result.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const user = await supabaseService.upsertUser(result.data);
    return NextResponse.json({ data: user });
  } catch (err) {
    return handleApiError(err);
  }
}
