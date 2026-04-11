import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

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
    return `${process.env.PINATA_GATEWAY}/${hash}`;
  } catch (error: any) {
    console.error("❌ Metadata Upload Error:", error.response?.data || error.message);
    throw error;
  }
};
