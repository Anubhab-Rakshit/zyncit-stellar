import { Contract, rpc, Keypair, Networks, TransactionBuilder, BASE_FEE, nativeToScVal } from "@stellar/stellar-sdk";
import dotenv from "dotenv";
import { emitPlatformEvent } from "../services/eventBus";
import { waitForTransactionFinality } from "../services/txTracker";
dotenv.config();
export const mintNFT = async (to, metadataURL) => {
    try {
        const rpcServer = new rpc.Server(process.env.RPC_URL);
        const accountKP = Keypair.fromSecret(process.env.PRIVATE_KEY);
        const sourceAccount = await rpcServer.getAccount(accountKP.publicKey());
        const contractId = process.env.CONTRACT_ADDRESS_CONTENTNFT;
        const contract = new Contract(contractId);
        console.log(`🔗 Minting NFT for ${to} ...`);
        const tx = new TransactionBuilder(sourceAccount, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(contract.call("mint", nativeToScVal(to, { type: "address" }), nativeToScVal(metadataURL, { type: "string" }), nativeToScVal(10, { type: "u32" })))
            .setTimeout(30)
            .build();
        const preppedTx = await rpcServer.prepareTransaction(tx);
        preppedTx.sign(accountKP);
        const sendRes = await rpcServer.sendTransaction(preppedTx);
        console.log("🚀 TX sent:", sendRes.hash);
        const finality = await waitForTransactionFinality(rpcServer, sendRes.hash, {
            action: "mint_nft",
            to,
        });
        if (finality.status !== "success") {
            return { success: false, error: "Transaction failed before finality", txHash: sendRes.hash };
        }
        emitPlatformEvent("nft_minted", {
            owner: to,
            metadataURL,
            txHash: sendRes.hash,
        });
        return { success: true, txHash: sendRes.hash, tokenId: "1" };
    }
    catch (error) {
        console.error("❌ Mint NFT Error:", error);
        return { success: false, error: error.message || error };
    }
};
