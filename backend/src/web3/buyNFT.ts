import { Contract, rpc, Keypair, Networks, TransactionBuilder, BASE_FEE, nativeToScVal } from "@stellar/stellar-sdk";

export const buyNFT = async (tokenId: number, priceInXLM: string) => {
  try {
    const rpcServer = new rpc.Server(process.env.RPC_URL!);
    const accountKP = Keypair.fromSecret(process.env.PRIVATE_KEY!);
    const sourceAccount = await rpcServer.getAccount(accountKP.publicKey());

    const contractId = process.env.CONTRACT_ADDRESS_PAYMENTESCROW!;
    const contract = new Contract(contractId);

    const tx = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        contract.call("instant_settle",
          nativeToScVal(accountKP.publicKey(), { type: "address" }),
          nativeToScVal(accountKP.publicKey(), { type: "address" }), 
          nativeToScVal(Number(priceInXLM) * 1e7, { type: "i128" }),
          nativeToScVal("native", { type: "symbol" })
        )
      )
      .setTimeout(30)
      .build();

    const preppedTx = await rpcServer.prepareTransaction(tx);
    preppedTx.sign(accountKP);
    const sendRes = await rpcServer.sendTransaction(preppedTx);

    console.log("💸 Buying NFT... tx:", sendRes.hash);

    return {
      success: true,
      txHash: sendRes.hash,
      buyer: accountKP.publicKey(),
    };
  } catch (error: any) {
    console.error("❌ BuyNFT error:", error);
    return {
      success: false,
      error: error.message || error,
    };
  }
};
