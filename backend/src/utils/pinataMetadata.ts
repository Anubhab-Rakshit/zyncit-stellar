import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const resolveGatewayBase = () => {
  const raw = process.env.PINATA_GATEWAY?.trim();
  if (!raw) return "https://ipfs.io/ipfs";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
};

export const uploadMetadataToPinata = async (name: string, description: string, imageURL: string) => {
  try {
    const metadata = {
      name,
      description,
      image: imageURL,
    };

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      }
    );

    const hash = res.data.IpfsHash;
    console.log("✅ Metadata uploaded:", hash);
    return `${resolveGatewayBase()}/${hash}`;
  } catch (error: any) {
    const reason = error?.response?.data?.error?.reason;
    const details = error?.response?.data?.error?.details;

    if (reason === "API_KEY_REVOKED") {
      const friendlyError = new Error("Pinata API key has been revoked. Update PINATA_JWT in backend env.");
      (friendlyError as any).code = "PINATA_API_KEY_REVOKED";
      throw friendlyError;
    }

    const message = details || error?.message || "Pinata metadata upload failed";
    const friendlyError = new Error(message);
    (friendlyError as any).code = "PINATA_METADATA_FAILED";
    console.error("❌ Metadata Upload Error:", message);
    throw friendlyError;
  }
};
