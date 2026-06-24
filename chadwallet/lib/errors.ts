// lib/errors.ts
import { NextResponse } from "next/server";

export class ApiError extends Error {
  public code: string;
  public status: number;

  constructor(
    code: string,
    message: string,
    status: number = 400
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BirdEyeError extends ApiError {
  constructor(message: string, status: number = 502) {
    super("BIRDEYE_API_ERROR", message, status);
    this.name = "BirdEyeError";
  }
}

export class JupiterError extends ApiError {
  constructor(message: string, status?: number);
  constructor(code: string, message: string, status?: number);
  constructor(arg1: string, arg2?: string | number, arg3?: number) {
    if (typeof arg2 === "string") {
      super(arg1, arg2, arg3 ?? 502);
    } else {
      super("JUPITER_API_ERROR", arg1, (arg2 as number) ?? 502);
    }
    this.name = "JupiterError";
  }
}

export class AlchemyError extends ApiError {
  constructor(message: string, status: number = 502) {
    super("ALCHEMY_API_ERROR", message, status);
    this.name = "AlchemyError";
  }
}

export class DatabaseError extends ApiError {
  constructor(message: string, status: number = 500) {
    super("DATABASE_ERROR", message, status);
    this.name = "DatabaseError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

export function handleApiError(err: unknown): NextResponse {
  console.error("API Error encountered:", err);

  if (err instanceof ApiError) {
    let status = err.status;
    if (err.code === "UNAUTHORIZED") {
      status = 401;
    } else if (err.code === "NOT_FOUND") {
      status = 404;
    } else if (err.code === "VALIDATION_ERROR") {
      status = 422;
    } else if (err.code === "NO_ROUTE_FOUND") {
      status = 422;
    }

    return NextResponse.json(
      {
        error: {
          code: err.code,
          message: err.message,
        },
      },
      { status }
    );
  }

  if (err instanceof NetworkError) {
    return NextResponse.json(
      {
        error: {
          code: "NETWORK_ERROR",
          message: err.message,
        },
      },
      { status: 503 } // Service Unavailable
    );
  }

  // Generic internal server error to hide raw details/secrets from clients
  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred.",
      },
    },
    { status: 500 }
  );
}
