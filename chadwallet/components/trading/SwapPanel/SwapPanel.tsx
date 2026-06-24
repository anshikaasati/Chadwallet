// components/trading/SwapPanel/SwapPanel.tsx
"use client";

import React, { useState } from "react";

export interface SwapPanelProps {
  tokenAddress: string;
  tokenSymbol: string;
  onSwapSuccess?: (_txHash: string) => void;
}

export function SwapPanel({
  tokenAddress,
  tokenSymbol,
  onSwapSuccess,
}: SwapPanelProps): React.JSX.Element {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<string>("");

  const handleSwap = () => {
    // TODO: Connect useSwapQuote and useSwapExecute hooks
    console.log(`Executing ${side} for ${amount} of ${tokenSymbol} (${tokenAddress})`);
    if (onSwapSuccess) {
      onSwapSuccess("dummy_tx_hash");
    }
  };

  return (
    <div className="p-4 bg-bg-surface border border-border rounded-lg flex flex-col gap-4">
      <div className="flex bg-bg-primary rounded-md p-1">
        <button
          onClick={() => setSide("buy")}
          className={`flex-1 py-2 font-bold rounded-md transition ${
            side === "buy" ? "bg-buy text-white" : "text-text-muted hover:text-text-primary"
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`flex-1 py-2 font-bold rounded-md transition ${
            side === "sell" ? "bg-sell text-white" : "text-text-muted hover:text-text-primary"
          }`}
        >
          SELL
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-text-muted font-semibold">Amount</label>
        <input
          type="number"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-bg-primary border border-border rounded-md p-3 text-text-primary font-mono focus:outline-none focus:border-accent"
        />
      </div>

      <button
        onClick={handleSwap}
        className={`w-full py-3 font-bold rounded-md transition ${
          side === "buy" ? "bg-buy text-white hover:bg-opacity-90" : "bg-sell text-white hover:bg-opacity-90"
        }`}
      >
        {side === "buy" ? "Buy" : "Sell"} {tokenSymbol}
      </button>
    </div>
  );
}
export default SwapPanel;
