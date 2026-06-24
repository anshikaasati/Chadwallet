// services/alchemy.service.ts

export class AlchemyService {
  /**
   * Retrieves the SOL balance for a public key.
   */
  async getBalance(publicKey: string): Promise<number> {
    // TODO: Implement actual RPC balance query via web3.js
    return 0;
  }

  /**
   * Confirms the transaction signature and returns status.
   */
  async getTransactionStatus(signature: string): Promise<"confirmed" | "failed" | "pending"> {
    // TODO: Implement actual transaction signature status check
    return "pending";
  }
}

export const alchemy = new AlchemyService();
export default alchemy;
