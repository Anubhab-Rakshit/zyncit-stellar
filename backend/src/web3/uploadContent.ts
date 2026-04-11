import { Contract, rpc, Keypair, Networks, TransactionBuilder, BASE_FEE, nativeToScVal } from "@stellar/stellar-sdk";

export const uploadContentToBlockchain = async (
  cid: string,
  fileHash: string,
  price: number = 0,
  paymentToken: string = ""
) => {
  try {
    const rpcServer = new rpc.Server(process.env.RPC_URL!);
    const accountKP = Keypair.fromSecret(process.env.PRIVATE_KEY!);
    const sourceAccount = await rpcServer.getAccount(accountKP.publicKey());

    const contractId = process.env.CONTRACT_ADDRESS_CONTENTREGISTRY!;
    const contract = new Contract(contractId);

    const tx = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        contract.call("register_content",
          nativeToScVal(accountKP.publicKey(), { type: "address" }),
          nativeToScVal(fileHash, { type: "symbol" }),
          nativeToScVal(cid, { type: "symbol" })
        )
      )
      .setTimeout(30)
      .build();

    const preppedTx = await rpcServer.prepareTransaction(tx);
    preppedTx.sign(accountKP);
    const sendRes = await rpcServer.sendTransaction(preppedTx);

    return {
      success: true,
      txHash: sendRes.hash,
      contentId: fileHash,
    };
  } catch (error) {
    console.error("❌ UploadContent error:", error);
    return { success: false, error };
  }
};
