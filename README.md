# ZYNC - Decentralized Content Platform (Stellar)

ZYNC is a high-fidelity decentralized content-sharing platform built exclusively for the **Stellar Blockchain** using **Soroban** smart contracts. The platform empowers creators with decentralized ownership, role-based access control, and automated royalty settlements.

## App Interface

### 🌐 Dynamic Homepage
Custom-built editorial interface with deep-layer parallax and glassmorphic navigation.
<img width="1280" alt="Homepage" src="assets/homepage-zync.png" />

### 🛰️ Freighter Authentication
Seamless Web3 integration using the official Stellar **Freighter Wallet** for secure identity verification.
<img width="1280" alt="Freighter Connection" src="assets/freighter-connection.png" />

### 💰 Wallet & Balance Management
Real-time tracking of native **XLM** balances via the Stellar Horizon API.
<img width="1280" alt="Wallet Balance" src="assets/wallet-balance-freighter.png" />

### 💎 NFT Content Registration
Direct-to-chain content minting where publishing metadata is permanently anchored to the Soroban network.
<img width="1280" alt="NFT Upload" src="assets/nft-upload-zync.png" />

---

## Technical Features

- **Decentralized Publishing**: Each piece of content is tokenized as a unique Soroban NFT on the Stellar network.
- **Smart Contract Infrastructure**: Logic-driven platform powered by 6 specialized Rust contracts.
- **Automated Royalties**: Transparent secondary sale distributions handled by the `RoyaltyManager` contract.
- **Role-Based Permissions**: Granular ecosystem control (Admin, Creator, Consumer, Moderator) via a native `AccessControl` system.
- **Blazing Fast Performance**: Sub-second finality and minimal gas fees on the Stellar Testnet.

---

## Technology Stack

- **Blockchain Engine**: Stellar (Soroban)
- **Contract Language**: Rust
- **Interface**: Next.js, TypeScript, Vanilla CSS
- **Infrastructure**: Express.js, Node.js
- **Metadata Vault**: MongoDB
- **Hardware Integration**: Freighter Wallet API

---

## Soroban Smart Contracts

| Contract Component | Deployment Address (Testnet) |
| :--- | :--- |
| **AccessControl** | `CAUXZFU6GH57S5QWSPO7M2I2ZMWWIX7VA4RFXOA6AT6724D5PTKBZ22A` |
| **ContentNFT** | `CA7VIJCB4D3A7LU2UZHIQDKKCREREBHRT6RLFS35NPT3GKCBMV73WBRW` |
| **RoyaltyManager** | `CBUKJDKA2DSQ4HF5IGAQDUJJ7TLDU3C44ZNA3D7T2IKEFG77T7XMNITS` |
| **PaymentEscrow** | `CC565PKCVD7OODIUP37R3UWRSDVYVPTWAIDKF22D3GNF6WCIYTT4VCGY` |
| **SubscriptionManager** | `CAPJ45XLMHCS75XDYCYJRGTVCXGFZM5FIGP2EBNV7A3C6WTL7COC5HC5` |
| **ContentRegistry** | `CBODPDB5DDR624WR5AFY4ISLYBI5CE3ENFZRZTDAP4FC5M4O6VRX5XKX` |

---

## Installation & Setup

### Prerequisites
1. [Node.js v18+](https://nodejs.org/)
2. [Freighter Extension](https://www.freighter.app/)
3. [Rust & Soroban Toolchain](https://soroban.stellar.org/docs/getting-started/setup)

### Local Deployment

1. **Clone & Setup Core**
   ```bash
   git clone https://github.com/Anubhab-Rakshit/zyncit-stellar
   cd zyncit-stellar
   ```

2. **Initialize Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Launch Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## License

This project is open-source. For information regarding contribution guidelines or terms of service, please refer to the [LICENSE](LICENSE) file.
