// lib/utils.ts

/**
 * Converts a human-readable token amount to its raw base units (lamports/smallest denomination).
 * Returns string to prevent JavaScript number precision loss.
 */
export function toBaseUnits(amount: number, decimals: number): string {
  const factor = Math.pow(10, decimals);
  return Math.round(amount * factor).toString();
}

/**
 * Converts raw token base units to a human-readable floating number representation.
 */
export function toHumanReadable(amount: string | number, decimals: number): number {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(value)) return 0;
  const factor = Math.pow(10, decimals);
  return value / factor;
}

/**
 * Formats a Solana wallet or mint address to abbreviated format (e.g. "Abc...xyz").
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/**
 * Formats a numeric USD price nicely for display.
 */
export function formatPrice(price: number): string {
  if (price === 0) return "$0.00";
  if (price < 0.01) {
    return `$${price.toFixed(6)}`;
  }
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
