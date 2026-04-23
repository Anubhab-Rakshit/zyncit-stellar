import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const PINATA_BASE_URL = "https://api.pinata.cloud/pinning";

const resolveGatewayBase = () => {
  const raw = process.env.PINATA_GATEWAY?.trim();
  if (!raw) return "https://ipfs.io/ipfs";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
};

export const uploadToPinata = async (filePath: string) => {
  try {
    const data = new FormData();
    data.append("file", fs.createReadStream(filePath));

    const res = await axios.post(`${PINATA_BASE_URL}/pinFileToIPFS`, data, {
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${(data as any)._boundary}`,
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    });

    const hash = res.data.IpfsHash;
    console.log("✅ Uploaded to IPFS:", hash);
    return `${resolveGatewayBase()}/${hash}`;
  } catch (error: any) {
    const reason = error?.response?.data?.error?.reason;
    const details = error?.response?.data?.error?.details;

    if (reason === "API_KEY_REVOKED") {
      const friendlyError = new Error("Pinata API key has been revoked. Update PINATA_JWT in backend env.");
      (friendlyError as any).code = "PINATA_API_KEY_REVOKED";
      throw friendlyError;
    }

    const message = details || error?.message || "Pinata upload failed";
    const friendlyError = new Error(message);
    (friendlyError as any).code = "PINATA_UPLOAD_FAILED";
    console.error("❌ Pinata Upload Error:", message);
    throw friendlyError;
  }
};
