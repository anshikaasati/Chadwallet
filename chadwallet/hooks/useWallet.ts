// hooks/useWallet.ts
"use client";

import { useWallets, useSignTransaction } from "@privy-io/react-auth/solana";
import { VersionedTransaction } from "@solana/web3.js";

export interface UseWalletReturn {
  wallet: unknown;
  publicKey: string | null;
  connected: boolean;
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>;
}

export function useWallet(): UseWalletReturn {
  const { wallets } = useWallets();
  const wallet = wallets[0] || null;
  const { signTransaction: privySignTransaction } = useSignTransaction();

  const signTransaction = async (tx: VersionedTransaction): Promise<VersionedTransaction> => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    const serializedTx = tx.serialize();
    const result = await privySignTransaction({
      transaction: serializedTx,
      wallet,
    });
    return VersionedTransaction.deserialize(result.signedTransaction);
  };

  return {
    wallet,
    publicKey: wallet ? wallet.address : null,
    connected: !!wallet,
    signTransaction,
  };
}
export default useWallet;

