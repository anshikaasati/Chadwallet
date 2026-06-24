// types/swap.types.ts
import { z } from "zod";

export interface QuoteRequest {
  inputMint: string;         // Solana mint address
  outputMint: string;
  amount: number;            // in lamports / base units (NOT human-readable)
  slippageBps: number;       // basis points, e.g. 50 = 0.5%
}

export const QuoteRequestSchema = z.object({
  inputMint: z.string().min(32).max(44),
  outputMint: z.string().min(32).max(44),
  amount: z.number().positive(),
  slippageBps: z.number().int().nonnegative().max(10000),
});

export interface QuoteResponse {
  inputMint: string;
  outputMint: string;
  inAmount: string;          // raw — from Jupiter (preserve as string)
  outAmount: string;         // raw — from Jupiter
  priceImpactPct: number;
  routePlan: RoutePlanStep[];
  otherAmountThreshold: string;
  swapMode: "ExactIn" | "ExactOut";
}

export const RoutePlanStepSchema = z.object({
  swapInfo: z.object({
    ammKey: z.string(),
    label: z.string(),
    inputMint: z.string(),
    outputMint: z.string(),
    inAmount: z.string(),
    outAmount: z.string(),
    feeAmount: z.string(),
    feeMint: z.string(),
  }),
  percent: z.number(),
});

export const QuoteResponseSchema = z.object({
  inputMint: z.string(),
  outputMint: z.string(),
  inAmount: z.string(),
  outAmount: z.string(),
  priceImpactPct: z.number(),
  routePlan: z.array(RoutePlanStepSchema),
  otherAmountThreshold: z.string(),
  swapMode: z.enum(["ExactIn", "ExactOut"]),
});

export interface RoutePlanStep {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
}

export interface SwapTransactionRequest {
  quoteResponse: QuoteResponse;
  userPublicKey: string;
  wrapAndUnwrapSol?: boolean;
}

export const SwapTransactionRequestSchema = z.object({
  quoteResponse: QuoteResponseSchema,
  userPublicKey: z.string().min(32).max(44),
  wrapAndUnwrapSol: z.boolean().optional(),
});

export interface SwapTransactionResponse {
  swapTransaction: string;   // base64-encoded serialized transaction
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
}
