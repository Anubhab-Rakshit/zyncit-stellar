import mongoose, { Schema, Document } from "mongoose";

export interface INFT extends Document {
  author: string;
  owner: string;
  name: string;
  description: string;
  price: number;
  forSale: boolean;
  imageURL: string;
  metadataURL: string;
  ipfsHash: string;
  tokenId: string;
  txHash: string;
}

const nftSchema = new Schema<INFT>(
  {
    author: { type: String, required: true },
    owner: { 
    type: String, 
    default: function() { 
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
    
  },
  { timestamps: true }
);

export default mongoose.model<INFT>("Nft", nftSchema);
