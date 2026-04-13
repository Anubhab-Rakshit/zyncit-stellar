import axios from "axios";
import FormData from "form-data";
import fs from "fs";
const PINATA_BASE_URL = "https://api.pinata.cloud/pinning";
export const uploadToPinata = async (filePath) => {
    try {
        const data = new FormData();
        data.append("file", fs.createReadStream(filePath));
        const res = await axios.post(`${PINATA_BASE_URL}/pinFileToIPFS`, data, {
            maxBodyLength: Infinity,
            headers: {
                "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
        });
        const hash = res.data.IpfsHash;
        console.log("✅ Uploaded to IPFS:", hash);
        return `${process.env.PINATA_GATEWAY}/${hash}`;
    }
    catch (error) {
        console.error("❌ Pinata Upload Error:", error.response?.data || error.message);
        throw error;
    }
};
