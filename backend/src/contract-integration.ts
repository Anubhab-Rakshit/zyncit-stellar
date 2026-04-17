import { uploadContentToBlockchain } from "./web3/uploadContent";
import { mintNFT } from "./utils/mintNFT";
import { buyNFT } from "./web3/buyNFT";

export interface BuyNftParams {
  tokenId: number;
  priceInXLM: string;
  buyerAddress: string;
  sellerAddress: string;
}

export const contractIntegration = {
  registerContent: uploadContentToBlockchain,
  mintContentNft: mintNFT,
  buyNftWithRoyalty: (params: BuyNftParams) => buyNFT(params),
};
