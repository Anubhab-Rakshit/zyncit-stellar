import mongoose, { Schema } from "mongoose";
const nftSchema = new Schema({
    author: { type: String, required: true },
    owner: {
        type: String,
        default: function () {
            return this.author;
        }
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, default: 0 },
    forSale: { type: Boolean, default: false },
    imageURL: { type: String, required: true },
    metadataURL: { type: String, required: true },
    ipfsHash: { type: String, required: true },
    tokenId: { type: String, required: true },
    txHash: { type: String, required: true },
}, { timestamps: true });
export default mongoose.model("Nft", nftSchema);
