import { Router } from "express";
import multer from "multer";
import fs from "fs";
import pkg from "js-sha3";
import { walletProtect } from "../middlewares/walletAuthMiddleware";
import { uploadToPinata } from "../utils/pinataUpload";
import { uploadMetadataToPinata } from "../utils/pinataMetadata";
import { mintNFT } from "../utils/mintNFT";
import { uploadContentToBlockchain } from "../web3/uploadContent";
import Nft from "../models/nft.models";
import { getAllNFTs, myNFTs, toggleNFTSale } from "../controllers/nft.Controller";

const { keccak256 } = pkg;

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/avatar", walletProtect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const filePath = req.file.path;
    const imageURL = await uploadToPinata(filePath);
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      imageURL,
    });
  } catch (error) {
    console.error("❌ Avatar upload error:", error);
    return res.status(500).json({ success: false, message: "Avatar upload failed", error });
  }
});

router.post("/upload", walletProtect, upload.single("file"), async (req, res) => {
  let filePath: string | undefined;
  try {
    const userAddress = (req as any).user.address;
    const { name, description, price } = req.body;

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    if (!name || !description) {
      return res.status(400).json({ message: "name and description are required" });
    }

    filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    // Step 1️⃣: Upload media to Pinata
    const imageURL = await uploadToPinata(filePath);
    const imageCid = imageURL.split("/").pop();
    if (!imageCid) {
      return res.status(500).json({ message: "Failed to derive media CID" });
    }

    // Step 2️⃣: Create metadata and upload to Pinata
    const metadataURL = await uploadMetadataToPinata(name, description, imageURL);
    const metadataCid = metadataURL.split("/").pop();
    if (!metadataCid) {
      return res.status(500).json({ message: "Failed to derive metadata CID" });
    }

    // Step 3️⃣: Register media fingerprint on ContentRegistry
    const fileHash = `0x${keccak256(fileBuffer)}`;
    const registryResult = await uploadContentToBlockchain(imageCid, fileHash);
    if (!registryResult.success) {
      return res.status(500).json({ message: "Blockchain content registration failed", error: registryResult.error });
    }

    // Step 4️⃣: Mint NFT on-chain with metadata
    const mintResult = await mintNFT(userAddress, metadataURL);
    if (!mintResult.success || !mintResult.txHash || !mintResult.tokenId) {
      return res.status(500).json({ message: "NFT mint failed", error: mintResult.error });
    }

    // Step 5️⃣: Save synced state to MongoDB
    const nft = await Nft.create({
      author: userAddress,
      owner: userAddress,
      name,
      description,
      imageURL,
      metadataURL,
      ipfsHash: metadataCid,
      tokenId: mintResult.tokenId,
      txHash: mintResult.txHash,
      registryTxHash: registryResult.txHash,
      contentId: registryResult.contentId,
      price: price ? Number(price) : 0,
      forSale: !!price && Number(price) > 0,
    });

    res.status(200).json({
      success: true,
      message: "✅ Media uploaded, content registered, NFT minted, and state synced",
      registry: {
        txHash: registryResult.txHash,
        contentId: registryResult.contentId,
        fileHash,
        mediaCid: imageCid,
      },
      nft,
    });
  } catch (error) {
    console.error("❌ Upload or Mint Error:", error);
    res.status(500).json({ message: "Upload or Mint failed", error });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

// 📜 NFT routes
router.get("/find", getAllNFTs);
router.get("/my-nfts", walletProtect, myNFTs);

router.put("/:tokenId/toggle-sale", walletProtect, toggleNFTSale);

export default router;
