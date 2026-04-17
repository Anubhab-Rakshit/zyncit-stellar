import { TransactionBuilder, BASE_FEE, nativeToScVal } from "@stellar/stellar-sdk";
import { emitPlatformEvent } from "../services/eventBus";
import { waitForTransactionFinality } from "../services/txTracker";
import { getContractIntegration } from "./contractIntegration";

export const uploadContentToBlockchain = async (
  cid: string,
  fileHash: string,
  price: number = 0,
  paymentToken: string = ""
) => {
  try {
    const { rpcServer, signer, sourceAccount, networkPassphrase, contracts } = await getContractIntegration();

    const tx = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(
        contracts.contentRegistry.call("register_content",
          nativeToScVal(signer.publicKey(), { type: "address" }),
          nativeToScVal(fileHash, { type: "string" }),
          nativeToScVal(cid, { type: "string" })
        )
      )
      .setTimeout(30)
      .build();

    const preppedTx = await rpcServer.prepareTransaction(tx);
    preppedTx.sign(signer);
    const sendRes = await rpcServer.sendTransaction(preppedTx);

    const finality = await waitForTransactionFinality(rpcServer, sendRes.hash, {
      action: "register_content",
      cid,
      fileHash,
    });

    if (finality.status !== "success") {
      return { success: false, error: "Transaction failed before finality", txHash: sendRes.hash };
    }

    emitPlatformEvent("nft_minted", {
      txHash: sendRes.hash,
      contentId: fileHash,
      cid,
    });

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
