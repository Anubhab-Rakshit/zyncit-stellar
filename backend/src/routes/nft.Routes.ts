import { Router } from "express";
import multer from "multer";
import fs from "fs";
import { keccak256 } from "js-sha3"; // ✅ proper Ethereum-compatible Keccak hashing
import { uploadToPinata } from "../utils/pinataUpload";
import { uploadContentToBlockchain } from "../web3/uploadContent";
import { walletProtect } from "../middlewares/walletAuthMiddleware";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-content", walletProtect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    // 1️⃣ Upload to Pinatao
    const IpfsHash = await uploadToPinata(filePath);

    // 2️⃣ Compute keccak256 hash of file (fixed)
    const fileHash = "0x" + keccak256(fileBuffer);

    // 3️⃣ Call smart contract (register content)
    const result = await uploadContentToBlockchain(IpfsHash, fileHash);

    if (!result.success) {
      fs.unlinkSync(filePath); // ensure cleanup if blockchain call fails
      return res.status(500).json({ message: "Blockchain registration failed", error: result.error });
    }

    // 4️⃣ Clean up temp file
    fs.unlinkSync(filePath);

    res.json({
      message: "✅ Content uploaded & registered successfully",
      ipfsCID: IpfsHash,
      fileHash,
      txHash: result.txHash,
      contentId: result.contentId,
    });
  } catch (error) {
    console.error(error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); // safe cleanup on error
    res.status(500).json({ message: "Upload error", error });
  }
});

export default router;
