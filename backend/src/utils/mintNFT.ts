import { Contract, rpc, Keypair, Networks, TransactionBuilder, BASE_FEE, nativeToScVal } from "@stellar/stellar-sdk";
import dotenv from "dotenv";
dotenv.config();

export const mintNFT = async (to: string, metadataURL: string) => {
  try {
    const rpcServer = new rpc.Server(process.env.RPC_URL!);
    const accountKP = Keypair.fromSecret(process.env.PRIVATE_KEY!);
    const sourceAccount = await rpcServer.getAccount(accountKP.publicKey());

    const contractId = process.env.CONTRACT_ADDRESS_CONTENTNFT!;
    const contract = new Contract(contractId);

    console.log(`🔗 Minting NFT for ${to} ...`);

    const tx = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        contract.call("mint",
          nativeToScVal(to, { type: "address" }),
          nativeToScVal(metadataURL, { type: "symbol" }),
          nativeToScVal(10, { type: "u32" })
        )
      )
      .setTimeout(30)
      .build();

    const preppedTx = await rpcServer.prepareTransaction(tx);
    preppedTx.sign(accountKP);
    const sendRes = await rpcServer.sendTransaction(preppedTx);

    console.log("🚀 TX sent:", sendRes.hash);

    return { success: true, txHash: sendRes.hash, tokenId: "1" };
  } catch (error: any) {
    console.error("❌ Mint NFT Error:", error);
    return { success: false, error: error.message || error };
  }
};
