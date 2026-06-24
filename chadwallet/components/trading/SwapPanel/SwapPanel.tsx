// components/trading/SwapPanel/SwapPanel.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSwapQuote } from "@/hooks/useSwapQuote";
import { useSwapExecute } from "@/hooks/useSwapExecute";
import { toBaseUnits, toHumanReadable, formatPrice } from "@/lib/utils";
import { SOL_MINT, USDC_MINT, DEFAULT_SLIPPAGE_BPS } from "@/constants";
import { Button } from "@/components/ui/Button/Button";
import { Spinner } from "@/components/ui/Spinner/Spinner";

export interface SwapPanelProps {
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  currentPositionBalance?: number;
  onSwapSuccess?: (txHash: string) => void;
}

export function SwapPanel({
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  currentPositionBalance = 0,
  onSwapSuccess,
}: SwapPanelProps): React.JSX.Element {
  const { authenticated, login } = usePrivy();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<string>("");
  const [slippagePreset, setSlippagePreset] = useState<number | "custom">(DEFAULT_SLIPPAGE_BPS);
  const [customSlippage, setCustomSlippage] = useState<string>("");

  const isSol = tokenAddress === SOL_MINT;
  const inputMint = side === "buy" ? (isSol ? USDC_MINT : SOL_MINT) : tokenAddress;
  const outputMint = side === "buy" ? tokenAddress : (isSol ? USDC_MINT : SOL_MINT);

  const inputDecimals = side === "buy" ? (isSol ? 6 : 9) : tokenDecimals;
  const outputDecimals = side === "buy" ? tokenDecimals : (isSol ? 6 : 9);
  const inputSymbol = side === "buy" ? (isSol ? "USDC" : "SOL") : tokenSymbol;
  const outputSymbol = side === "buy" ? tokenSymbol : (isSol ? "USDC" : "SOL");

  // Slippage calculations
  let slippageBps = DEFAULT_SLIPPAGE_BPS;
  if (slippagePreset === "custom") {
    const parsedCustom = parseFloat(customSlippage);
    if (!isNaN(parsedCustom) && parsedCustom >= 0 && parsedCustom <= 100) {
      slippageBps = Math.round(parsedCustom * 100);
    }
  } else {
    slippageBps = slippagePreset;
  }

  // Parse human-readable input amount to base units
  const parsedAmount = parseFloat(amount);
  const baseUnitsAmount = !isNaN(parsedAmount) && parsedAmount > 0
    ? toBaseUnits(parsedAmount, inputDecimals)
    : 0;

  // Retrieve quote
  const { quote, isLoading: isQuoteLoading, error: quoteError } = useSwapQuote(
    inputMint,
    outputMint,
    baseUnitsAmount,
    slippageBps
  );

  // Swap execution hook
  const { executeSwap, isExecuting, txHash, error: executeError, status } = useSwapExecute();

  // Reset inputs when switching side or token
  useEffect(() => {
    setAmount("");
  }, [side, tokenAddress]);

  const handleSwapSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!quote || isExecuting) return;

    try {
      const signature = await executeSwap(
        quote,
        tokenSymbol,
        tokenDecimals,
        side,
        currentPositionBalance
      );
      if (onSwapSuccess) {
        onSwapSuccess(signature);
      }
      setAmount("");
    } catch (err) {
      console.error("Failed to execute swap:", err);
    }
  };

  const formattedOutAmount = quote
    ? toHumanReadable(quote.outAmount, outputDecimals).toLocaleString(undefined, { maximumFractionDigits: 6 })
    : "0.0";

  const priceImpact = quote ? quote.priceImpactPct : 0;
  const showModerateWarning = priceImpact >= 2 && priceImpact < 5;
  const showSevereWarning = priceImpact >= 5;

  // Render execution status text
  const getStatusText = (): string => {
    switch (status) {
      case "building": return "Building swap transaction...";
      case "signing": return "Waiting for wallet signature...";
      case "sending": return "Broadcasting transaction to Solana RPC...";
      case "confirming": return "Confirming transaction on-chain...";
      case "confirmed": return "Transaction confirmed!";
      case "failed": return "Transaction failed.";
      default: return "";
    }
  };

  return (
    <div className="p-5 bg-bg-surface border border-border rounded-xl shadow-sm flex flex-col gap-4">
      {/* Side Selector */}
      <div className="flex bg-bg-primary rounded-lg p-1 border border-border">
        <button
          type="button"
          onClick={() => setSide("buy")}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
            side === "buy"
              ? "bg-buy text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          Buy {tokenSymbol}
        </button>
        <button
          type="button"
          onClick={() => setSide("sell")}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
            side === "sell"
              ? "bg-sell text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          Sell {tokenSymbol}
        </button>
      </div>

      <form onSubmit={handleSwapSubmit} className="flex flex-col gap-4">
        {/* Input Card */}
        <div className="bg-bg-primary border border-border p-4 rounded-xl flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-bold text-text-muted uppercase tracking-wider">
            <span>You Pay</span>
            <span>Asset: {inputSymbol}</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isExecuting}
              className="bg-transparent border-0 outline-none text-xl font-extrabold font-mono text-text-primary placeholder:text-text-muted/40 w-full p-0 focus:ring-0"
              required
            />
            <span className="text-sm font-bold text-text-muted">{inputSymbol}</span>
          </div>
        </div>

        {/* Output Card */}
        <div className="bg-bg-primary border border-border p-4 rounded-xl flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-bold text-text-muted uppercase tracking-wider">
            <span>You Receive</span>
            <span>Asset: {outputSymbol}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="text-xl font-extrabold font-mono text-text-primary truncate">
              {isQuoteLoading ? (
                <div className="h-7 w-24 bg-bg-surface shimmer-bg rounded animate-pulse" />
              ) : (
                formattedOutAmount
              )}
            </div>
            <span className="text-sm font-bold text-text-muted flex-shrink-0">{outputSymbol}</span>
          </div>
        </div>

        {/* Slippage Settings */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Slippage Tolerance</span>
          <div className="flex flex-wrap gap-1.5">
            {[25, 50, 100].map((bps) => (
              <button
                key={bps}
                type="button"
                onClick={() => {
                  setSlippagePreset(bps);
                  setCustomSlippage("");
                }}
                disabled={isExecuting}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  slippagePreset === bps
                    ? "bg-accent border-accent text-text-primary"
                    : "bg-bg-primary border-border/70 text-text-muted hover:border-border hover:text-text-primary"
                }`}
              >
                {(bps / 100).toFixed(2)}%
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSlippagePreset("custom")}
              disabled={isExecuting}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                slippagePreset === "custom"
                  ? "bg-accent border-accent text-text-primary"
                  : "bg-bg-primary border-border/70 text-text-muted hover:border-border hover:text-text-primary"
              }`}
            >
              Custom
            </button>
            {slippagePreset === "custom" && (
              <div className="flex items-center bg-bg-primary border border-border rounded-lg px-2 py-0.5 ml-auto w-24">
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="100"
                  placeholder="1.0"
                  value={customSlippage}
                  onChange={(e) => setCustomSlippage(e.target.value)}
                  className="bg-transparent border-0 outline-none w-full text-xs font-bold font-mono text-text-primary p-0 focus:ring-0 text-right pr-1"
                />
                <span className="text-xs font-bold text-text-muted">%</span>
              </div>
            )}
          </div>
        </div>

        {/* Warnings Card */}
        {quote && (
          <div className="flex flex-col gap-2.5 text-xs font-semibold">
            {showModerateWarning && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-lg">
                Warning: High Price Impact ({priceImpact.toFixed(2)}%). You may receive fewer tokens.
              </div>
            )}
            {showSevereWarning && (
              <div className="p-3 bg-sell/10 border border-sell/20 text-sell rounded-lg font-bold">
                Caution: Critical Price Impact ({priceImpact.toFixed(2)}%). High risk of slippage loss.
              </div>
            )}
            <div className="flex justify-between items-center text-text-muted">
              <span>Price Impact</span>
              <span className={`font-mono font-bold ${priceImpact >= 5 ? "text-sell" : priceImpact >= 2 ? "text-yellow-500" : "text-text-primary"}`}>
                {priceImpact.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center text-text-muted">
              <span>Slippage Limit</span>
              <span className="font-mono text-text-primary">{(slippageBps / 100).toFixed(2)}%</span>
            </div>
          </div>
        )}

        {quoteError && (
          <div className="p-3 bg-sell/10 border border-sell/20 text-sell text-xs rounded-lg font-bold text-center">
            {quoteError.message.includes("ROUTE_NOT_FOUND") || quoteError.message.includes("route")
              ? "No swap route found for this pair."
              : quoteError.message}
          </div>
        )}

        {/* Action Button */}
        {!authenticated ? (
          <Button
            type="button"
            onClick={login}
            className="w-full py-3 font-extrabold bg-accent text-text-primary rounded-xl text-sm"
          >
            Connect Wallet to Trade
          </Button>
        ) : isExecuting ? (
          <div className="flex flex-col items-center justify-center p-3 bg-bg-primary border border-border rounded-xl gap-2 text-center text-xs">
            <div className="flex items-center gap-2 font-bold text-accent">
              <Spinner size="sm" />
              {getStatusText()}
            </div>
            {txHash && (
              <a
                href={`https://solscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[10px] text-text-muted hover:text-accent font-mono truncate max-w-full"
              >
                Track signature: {txHash}
              </a>
            )}
          </div>
        ) : (
          <Button
            type="submit"
            disabled={!quote || isQuoteLoading}
            className={`w-full py-3 font-extrabold rounded-xl text-sm text-text-primary ${
              side === "buy" ? "bg-buy hover:bg-buy/90" : "bg-sell hover:bg-sell/90"
            }`}
          >
            Confirm {side === "buy" ? "Buy" : "Sell"} {tokenSymbol}
          </Button>
        )}

        {/* Execution Error */}
        {executeError && (
          <div className="p-3 bg-sell/10 border border-sell/20 text-sell text-xs rounded-lg font-bold text-center flex flex-col gap-1.5">
            <span>Transaction failed, funds not moved.</span>
            <span className="text-[10px] opacity-75 font-mono truncate max-w-full">{executeError.message}</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default SwapPanel;

