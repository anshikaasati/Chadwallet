// lib/utils.ts

/**
 * Converts a human-readable token amount to its raw base units (lamports/smallest denomination).
 */
export function toBaseUnits(amount: number | string, decimals: number): number {
  const val = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(val)) return 0;
  return Math.round(val * Math.pow(10, decimals));
}

/**
 * Converts raw token base units to a human-readable floating number representation.
 */
export function toHumanReadable(amount: number | string, decimals: number): number {
  const val = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(val)) return 0;
  return val / Math.pow(10, decimals);
}

/**
 * Formats a Solana wallet or mint address to abbreviated format (e.g. "Abc1...xyz9").
 */
export function abbreviateAddress(address: string): string {
  if (!address || address.length < 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/**
 * Backwards compatibility alias for abbreviateAddress.
 */
export function formatAddress(address: string): string {
  return abbreviateAddress(address);
}

/**
 * Formats a numeric USD price nicely for display based on magnitude.
 */
export function formatPrice(price: number): string {
  if (price === 0 || price === null || price === undefined || isNaN(price)) {
    return "$0.00";
  }
  if (price < 0.0001) {
    const numStr = price.toFixed(20);
    const match = numStr.match(/^0\.0*[1-9]/);
    if (match) {
      const leadingLength = match[0].length;
      const totalDecimals = leadingLength - 2 + 5; // 6 sig figs
      return `$${price.toFixed(Math.min(20, totalDecimals))}`;
    }
    return `$${price.toFixed(6)}`;
  }
  if (price < 1) {
    return `$${price.toFixed(4)}`;
  }
  if (price <= 1000) {
    return `$${price.toFixed(2)}`;
  }
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Formats a large number into an abbreviated representation (e.g. 1.2M, 34.5B).
 */
export function formatLargeNumber(n: number): string {
  if (n === null || n === undefined || isNaN(n)) {
    return "0";
  }
  if (n >= 1_000_000_000) {
    return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  }
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(0)}K`;
  }
  return n.toString();
}

/**
 * Backwards compatibility alias for formatLargeNumber.
 */
export function formatNumberAbbreviated(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) {
    return "N/A";
  }
  return formatLargeNumber(val);
}

/**
 * Formats percent yield change with sign always shown.
 */
export function formatPercent(n: number): string {
  if (n === null || n === undefined || isNaN(n)) {
    return "0.00%";
  }
  const prefix = n >= 0 ? "+" : "";
  return `${prefix}${n.toFixed(2)}%`;
}

/**
 * Formats relative time since a timestamp.
 */
export function formatRelativeTime(timestampMs: number): string {
  const now = Date.now();
  const diffSec = Math.floor((now - timestampMs) / 1000);
  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}

