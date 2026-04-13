import { Router } from "express";
import multer from "multer";
import fs from "fs";
import { walletProtect } from "../middlewares/walletAuthMiddleware";
import { uploadToPinata } from "../utils/pinataUpload";
import { uploadMetadataToPinata } from "../utils/pinataMetadata";
import { mintNFT } from "../utils/mintNFT";
import Nft from "../models/nft.models";
import { getAllNFTs, myNFTs, toggleNFTSale } from "../controllers/nft.Controller";
const router = Router();
const upload = multer({ dest: "uploads/" });
router.post("/avatar", walletProtect, upload.single("file"), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ success: false, message: "No file uploaded" });
        const filePath = req.file.path;
        const imageURL = await uploadToPinata(filePath);
        fs.unlinkSync(filePath);
        return res.status(200).json({
            success: true,
            message: "Avatar uploaded successfully",
            imageURL,
        });
    }
    catch (error) {
        console.error("❌ Avatar upload error:", error);
        return res.status(500).json({ success: false, message: "Avatar upload failed", error });
    }
});
router.post("/upload", walletProtect, upload.single("file"), async (req, res) => {
    try {
        const userAddress = req.user.address;
        const { name, description, price } = req.body;
        if (!req.file)
            return res.status(400).json({ message: "No file uploaded" });
        // Step 1️⃣: Upload file to Pinata
        const filePath = req.file.path;
        const imageURL = await uploadToPinata(filePath);
        fs.unlinkSync(filePath);
        // Step 2️⃣: Create metadata and upload to Pinata
        const metadataURL = await uploadMetadataToPinata(name, description, imageURL);
        const ipfsHash = metadataURL.split("/").pop();
        // Step 3️⃣: Mint NFT on-chain
        const { txHash, tokenId } = await mintNFT(userAddress, metadataURL);
        // Step 4️⃣: Save NFT info to MongoDB
        const nft = await Nft.create({
            author: userAddress,
            owner: userAddress,
            name,
            description,
            imageURL,
            metadataURL,
            ipfsHash,
            tokenId,
            txHash,
            price: price ? Number(price) : 0, // ✅ set price if provided
            forSale: !!price && Number(price) > 0, // ✅ auto-mark for sale if price > 0
        });
        res.status(200).json({
            success: true,
            message: "✅ NFT minted successfully",
            nft,
        });
    }
    catch (error) {
        console.error("❌ Upload or Mint Error:", error);
        res.status(500).json({ message: "Upload or Mint failed", error });
    }
});
// 📜 NFT routes
router.get("/find", getAllNFTs);
router.get("/my-nfts", walletProtect, myNFTs);
router.put("/:tokenId/toggle-sale", walletProtect, toggleNFTSale);
export default router;
