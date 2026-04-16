import { Contract, rpc, Keypair, Networks, TransactionBuilder, BASE_FEE, nativeToScVal } from "@stellar/stellar-sdk";
import { emitPlatformEvent } from "../services/eventBus";
import { waitForTransactionFinality } from "../services/txTracker";

interface BuyNftArgs {
  tokenId: number;
  priceInXLM: string;
  buyerAddress: string;
  sellerAddress: string;
}

export const buyNFT = async ({ tokenId, priceInXLM, buyerAddress, sellerAddress }: BuyNftArgs) => {
  try {
    const rpcServer = new rpc.Server(process.env.RPC_URL!);
    const accountKP = Keypair.fromSecret(process.env.PRIVATE_KEY!);
    const sourceAccount = await rpcServer.getAccount(accountKP.publicKey());

    const paymentEscrowContractId = process.env.CONTRACT_ADDRESS_PAYMENTESCROW!;
    const royaltyManagerContractId = process.env.CONTRACT_ADDRESS_ROYALTYMANAGER!;
    const contract = new Contract(paymentEscrowContractId);
    const stroops = Math.round(Number(priceInXLM) * 1e7);

    if (!Number.isFinite(stroops) || stroops <= 0) {
      return {
        success: false,
        error: "Invalid XLM amount",
      };
    }

    const tx = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        contract.call(
          "instant_settle_with_royalty",
          nativeToScVal(buyerAddress, { type: "address" }),
          nativeToScVal(sellerAddress, { type: "address" }),
          nativeToScVal(stroops, { type: "i128" }),
          nativeToScVal(accountKP.publicKey(), { type: "address" }),
          nativeToScVal(royaltyManagerContractId, { type: "address" }),
          nativeToScVal(tokenId, { type: "u128" })
        )
      )
      .setTimeout(30)
      .build();

    const preppedTx = await rpcServer.prepareTransaction(tx);
    preppedTx.sign(accountKP);
    const sendRes = await rpcServer.sendTransaction(preppedTx);

    const finality = await waitForTransactionFinality(rpcServer, sendRes.hash, {
      action: "buy_nft",
      tokenId,
      priceInXLM,
    });

    if (finality.status !== "success") {
      return {
        success: false,
        error: "Transaction failed before finality",
        txHash: sendRes.hash,
      };
    }

    emitPlatformEvent("nft_purchased", {
      tokenId,
      priceInXLM,
      txHash: sendRes.hash,
      buyer: buyerAddress,
      seller: sellerAddress,
    });

    console.log("💸 Buying NFT... tx:", sendRes.hash);

    return {
      success: true,
      txHash: sendRes.hash,
      buyer: buyerAddress,
      seller: sellerAddress,
      royaltyEnabled: true,
    };
  } catch (error: any) {
    console.error("❌ BuyNFT error:", error);
    return {
      success: false,
      error: error.message || error,
    };
  }
};
