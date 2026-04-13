import { Contract, rpc, Keypair, Networks, TransactionBuilder, BASE_FEE, nativeToScVal } from "@stellar/stellar-sdk";
import { emitPlatformEvent } from "../services/eventBus";
import { waitForTransactionFinality } from "../services/txTracker";
export const uploadContentToBlockchain = async (cid, fileHash, price = 0, paymentToken = "") => {
    try {
        const rpcServer = new rpc.Server(process.env.RPC_URL);
        const accountKP = Keypair.fromSecret(process.env.PRIVATE_KEY);
        const sourceAccount = await rpcServer.getAccount(accountKP.publicKey());
        const contractId = process.env.CONTRACT_ADDRESS_CONTENTREGISTRY;
        const contract = new Contract(contractId);
        const tx = new TransactionBuilder(sourceAccount, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(contract.call("register_content", nativeToScVal(accountKP.publicKey(), { type: "address" }), nativeToScVal(fileHash, { type: "string" }), nativeToScVal(cid, { type: "string" })))
            .setTimeout(30)
            .build();
        const preppedTx = await rpcServer.prepareTransaction(tx);
        preppedTx.sign(accountKP);
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
    }
    catch (error) {
        console.error("❌ UploadContent error:", error);
        return { success: false, error };
    }
};
