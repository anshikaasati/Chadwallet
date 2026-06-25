// components/trading/SwapPanel/SwapPanel.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSwapQuote } from "@/hooks/useSwapQuote";
import { useSwapExecute } from "@/hooks/useSwapExecute";
import { toBaseUnits, toHumanReadable, formatPrice } from "@/lib/utils";
import { SOL_MINT, USDC_MINT, DEFAULT_SLIPPAGE_BPS, ALCHEMY_RPC_URL } from "@/constants";
import { Button } from "@/components/ui/Button/Button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@/hooks/useWallet";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

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
  const { publicKey } = useWallet();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<string>("");
  const [slippagePreset, setSlippagePreset] = useState<number | "custom">(DEFAULT_SLIPPAGE_BPS);
  const [customSlippage, setCustomSlippage] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const [solBalance, setSolBalance] = useState<number>(0);

  const isSol = tokenAddress === SOL_MINT;
  const inputMint = side === "buy" ? (isSol ? USDC_MINT : SOL_MINT) : tokenAddress;
  const outputMint = side === "buy" ? tokenAddress : (isSol ? USDC_MINT : SOL_MINT);

  const inputDecimals = side === "buy" ? (isSol ? 6 : 9) : tokenDecimals;
  const outputDecimals = side === "buy" ? tokenDecimals : (isSol ? 6 : 9);
  const inputSymbol = side === "buy" ? (isSol ? "USDC" : "SOL") : tokenSymbol;
  const outputSymbol = side === "buy" ? tokenSymbol : (isSol ? "USDC" : "SOL");

  // Fetch SOL balance for buy shortcuts
  useEffect(() => {
    if (!publicKey || !authenticated) return;
    
    let active = true;
    const rpcUrl = ALCHEMY_RPC_URL || "https://api.mainnet-beta.solana.com";
    const conn = new Connection(rpcUrl, "confirmed");
    
    const fetchBalance = async () => {
      try {
        const bal = await conn.getBalance(new PublicKey(publicKey));
        if (active) {
          setSolBalance(bal / 1e9);
        }
      } catch (err) {
        console.warn("Failed to fetch SOL balance for shortcuts:", err);
      }
    };
    
    fetchBalance();
    
    // Refresh balance periodically
    const interval = setInterval(fetchBalance, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [publicKey, authenticated]);

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
      
      // Trigger Confetti!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: side === "buy" ? ["#14F195", "#9945FF", "#00D4FF"] : ["#FF5C5C", "#FFFFFF"]
      });

      if (onSwapSuccess) {
        onSwapSuccess(signature);
      }
      setAmount("");
    } catch (err) {
      console.error("Failed to execute swap:", err);
    }
  };

  // Shortcut triggers
  const handleShortcutClick = (pct: number) => {
    if (side === "sell") {
      if (currentPositionBalance > 0) {
        const val = currentPositionBalance * pct;
        setAmount(val.toFixed(Math.min(6, tokenDecimals)));
      }
    } else {
      // Buy mode: calculate SOL fraction (keep 0.02 SOL for gas fees)
      if (inputSymbol === "SOL" && solBalance > 0.02) {
        const spendableSol = solBalance - 0.02;
        const val = spendableSol * pct;
        setAmount(val.toFixed(4));
      }
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
      case "sending": return "Broadcasting transaction to Solana...";
      case "confirming": return "Confirming on-chain...";
      case "confirmed": return "Transaction confirmed!";
      case "failed": return "Transaction failed.";
      default: return "";
    }
  };

  return (
    <div className="p-5 bg-[#0b1120]/45 border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col gap-5 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      {/* Side Selector Tabs */}
      <div className="flex bg-black/60 rounded-xl p-1 border border-white/10 relative">
        <button
          type="button"
          onClick={() => setSide("buy")}
          className="relative flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-colors z-10 cursor-pointer text-center"
        >
          <span className={side === "buy" ? "text-white" : "text-text-muted hover:text-white"}>Buy</span>
          {side === "buy" && (
            <motion.div
              layoutId="swap-side"
              className="absolute inset-0 bg-buy rounded-lg z-[-1] shadow-md shadow-buy/20"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
        <button
          type="button"
          onClick={() => setSide("sell")}
          className="relative flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-colors z-10 cursor-pointer text-center"
        >
          <span className={side === "sell" ? "text-white" : "text-text-muted hover:text-white"}>Sell</span>
          {side === "sell" && (
            <motion.div
              layoutId="swap-side"
              className="absolute inset-0 bg-sell rounded-lg z-[-1] shadow-md shadow-sell/20"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      </div>

      <form onSubmit={handleSwapSubmit} className="flex flex-col gap-5">
        {/* Input Card */}
        <div className={`bg-black/40 border p-4 rounded-2xl flex flex-col gap-2 transition-all duration-300 ${
          isFocused ? "border-accent shadow-[0_0_15px_rgba(153,69,255,0.1)]" : "border-white/5"
        }`}>
          <div className="flex justify-between items-center text-[9px] font-black text-text-dim uppercase tracking-wider">
            <span>You Pay</span>
            <span className="font-mono">
              Balance: {side === "sell" ? currentPositionBalance.toLocaleString(undefined, { maximumFractionDigits: 6 }) : solBalance.toFixed(4)} {inputSymbol}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isExecuting}
              className="bg-transparent border-0 outline-none text-xl font-black font-mono text-white placeholder:text-text-dim/30 w-full p-0 focus:ring-0"
              required
            />
            <span className="text-xs font-black text-white bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg shrink-0">{inputSymbol}</span>
          </div>

          {/* Balance Shortcuts */}
          <div className="flex gap-1.5 mt-2">
            {[0.25, 0.5, 0.75, 1.0].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handleShortcutClick(pct)}
                disabled={isExecuting}
                className="flex-1 py-1 text-[9px] font-black text-text-muted hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-colors cursor-pointer text-center"
              >
                {pct === 1.0 ? "MAX" : `${pct * 100}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Output Card */}
        <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
          <div className="flex justify-between items-center text-[9px] font-black text-text-dim uppercase tracking-wider">
            <span>You Receive</span>
            <span>Est. Rate</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="text-xl font-black font-mono text-white truncate">
              {isQuoteLoading ? (
                <div className="h-6 w-24 bg-white/5 shimmer-bg rounded animate-pulse" />
              ) : (
                formattedOutAmount
              )}
            </div>
            <span className="text-xs font-black text-white bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg shrink-0">{outputSymbol}</span>
          </div>
        </div>

        {/* Slippage Settings */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-black text-text-dim uppercase tracking-wider">Slippage Tolerance</span>
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
                className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer ${
                  slippagePreset === bps
                    ? "bg-accent border-accent text-white"
                    : "bg-white/5 border-white/5 text-text-muted hover:border-white/10 hover:text-white"
                }`}
              >
                {(bps / 100).toFixed(2)}%
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSlippagePreset("custom")}
              disabled={isExecuting}
              className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer ${
                slippagePreset === "custom"
                  ? "bg-accent border-accent text-white"
                  : "bg-white/5 border-white/5 text-text-muted hover:border-white/10 hover:text-white"
              }`}
            >
              Custom
            </button>
            {slippagePreset === "custom" && (
              <div className="flex items-center bg-black/40 border border-white/10 rounded-lg px-2.5 py-0.5 ml-auto w-24">
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="100"
                  placeholder="1.0"
                  value={customSlippage}
                  onChange={(e) => setCustomSlippage(e.target.value)}
                  className="bg-transparent border-0 outline-none w-full text-[10px] font-bold font-mono text-white p-0 focus:ring-0 text-right pr-1"
                />
                <span className="text-[10px] font-bold text-text-dim">%</span>
              </div>
            )}
          </div>
        </div>

        {/* Warnings Card */}
        {quote && (
          <div className="flex flex-col gap-2.5 text-xs font-semibold">
            {showModerateWarning && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                Warning: High Price Impact ({priceImpact.toFixed(2)}%). You may receive fewer tokens.
              </div>
            )}
            {showSevereWarning && (
              <div className="p-3 bg-sell/10 border border-sell/25 text-sell rounded-xl font-bold">
                Caution: Critical Price Impact ({priceImpact.toFixed(2)}%). High risk of slippage loss.
              </div>
            )}
            <div className="flex justify-between items-center text-text-muted">
              <span className="text-[10px] font-bold uppercase tracking-wider">Price Impact</span>
              <span className={`font-mono font-black ${priceImpact >= 5 ? "text-sell" : priceImpact >= 2 ? "text-amber-500" : "text-white"}`}>
                {priceImpact.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center text-text-muted">
              <span className="text-[10px] font-bold uppercase tracking-wider">Slippage Limit</span>
              <span className="font-mono text-white">{(slippageBps / 100).toFixed(2)}%</span>
            </div>
          </div>
        )}

        {quoteError && (
          <div className="p-3 bg-sell/10 border border-sell/20 text-sell text-xs rounded-xl font-bold text-center">
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
            className="w-full py-4 font-black bg-accent hover:bg-opacity-95 text-white rounded-2xl text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(153,69,255,0.25)] active:scale-[0.98] transition-all cursor-pointer border-0"
          >
            Sign in to trade
          </Button>
        ) : isExecuting ? (
          <div className="flex flex-col items-center justify-center p-4 bg-black/40 border border-white/5 rounded-2xl gap-2 text-center text-xs">
            <div className="flex items-center gap-2 font-bold text-accent-light">
              <Spinner size="sm" />
              {getStatusText()}
            </div>
            {txHash && (
              <a
                href={`https://solscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[9px] text-text-dim hover:text-accent-light font-mono truncate max-w-full"
              >
                Track signature: {txHash}
              </a>
            )}
          </div>
        ) : (
          <Button
            type="submit"
            disabled={!quote || isQuoteLoading || priceImpact >= 5}
            className={`w-full py-4 font-black rounded-2xl text-xs text-white uppercase tracking-wider active:scale-[0.98] transition-all border-0 cursor-pointer ${
              priceImpact >= 5
                ? "bg-white/5 text-text-dim cursor-not-allowed"
                : side === "buy"
                ? "bg-gradient-to-r from-buy to-emerald-600 hover:from-emerald-500 hover:to-emerald-600 shadow-[0_4px_20px_rgba(20,241,149,0.25)]"
                : "bg-gradient-to-r from-sell to-rose-600 hover:from-rose-500 hover:to-rose-600 shadow-[0_4px_20px_rgba(255,92,92,0.25)]"
            }`}
          >
            {priceImpact >= 5
              ? "Price Impact Too High"
              : `Confirm ${side === "buy" ? "Buy" : "Sell"} ${tokenSymbol}`}
          </Button>
        )}

        {/* Execution Error */}
        {executeError && (
          <div className="p-3 bg-sell/10 border border-sell/20 text-sell text-xs rounded-xl font-bold text-center flex flex-col gap-1.5">
            <span>Transaction failed, funds not moved.</span>
            <span className="text-[9px] opacity-75 font-mono truncate max-w-full">{executeError.message}</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default SwapPanel;

