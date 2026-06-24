// hooks/useWallet.ts
import { Transaction, VersionedTransaction } from "@solana/web3.js";

export interface UseWalletReturn {
  wallet: unknown;
  publicKey: string | null;
  signTransaction: ((tx: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>) | null;
  connected: boolean;
}

export function useWallet(): UseWalletReturn {
  // TODO: Connect Privy embedded wallet hooks (useSolanaWallets)
  return {
    wallet: null,
    publicKey: null,
    signTransaction: null,
    connected: false,
  };
}
export default useWallet;
