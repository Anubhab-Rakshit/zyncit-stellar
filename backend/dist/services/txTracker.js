import { rpc, xdr } from "@stellar/stellar-sdk";
import { emitPlatformEvent } from "./eventBus";
export const emitTxStatus = (txHash, status, context) => {
    emitPlatformEvent("tx_status", {
        txHash,
        status,
        context: context ?? {},
    });
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const extractResultMetaXdr = (result) => {
    const candidate = result;
    return candidate.resultMetaXdr ?? candidate.result_meta_xdr ?? candidate.resultMeta ?? null;
};
export const waitForTransactionFinality = async (rpcServer, txHash, context) => {
    emitTxStatus(txHash, "pending", context);
    for (let attempt = 0; attempt < 30; attempt += 1) {
        try {
            const tx = await rpcServer.getTransaction(txHash);
            if (tx.status === rpc.Api.GetTransactionStatus.SUCCESS) {
                const resultMetaXdr = extractResultMetaXdr(tx);
                emitTxStatus(txHash, "success", context);
                return {
                    status: "success",
                    resultMetaXdr: resultMetaXdr ?? undefined,
                };
            }
            if (tx.status === rpc.Api.GetTransactionStatus.FAILED ||
                tx.status === rpc.Api.GetTransactionStatus.NOT_FOUND) {
                emitTxStatus(txHash, "fail", context);
                return { status: "fail" };
            }
        }
        catch (_error) {
            // Keep polling and let timeout determine failure.
        }
        await sleep(1500);
    }
    emitTxStatus(txHash, "fail", context);
    return { status: "fail" };
};
export const extractReturnValueFromMeta = (resultMetaXdr) => {
    if (!resultMetaXdr)
        return null;
    try {
        const meta = xdr.TransactionMeta.fromXDR(resultMetaXdr, "base64");
        const v3 = meta.v3();
        const operations = v3?.sorobanMeta()?.returnValue();
        if (!operations)
            return null;
        return operations.toXDR("base64");
    }
    catch (_error) {
        return null;
    }
};
