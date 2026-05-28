# Decentralised YouTube

A decentralized platform for user-generated content, where any user can upload videos, store them on IPFS, and mint them as NFTs on the blockchain. This project ensures true decentralization by allowing content creators to fully own their videos.

---

## Features

- Upload videos from any connected Web3 wallet (e.g., MetaMask).
- Videos are stored on IPFS for decentralized hosting.
- Each video is minted as an NFT, with the uploader as the owner.
- Video listing displays all uploaded videos along with their owners.
- Provides user feedback during upload (e.g., "Uploading..." state).

---

## Technologies Used

- **Solidity**: Smart contract for uploading videos and minting NFTs.
- **React.js**: Frontend UI for video upload and listing.
- **IPFS**: Decentralized storage for video files.
- **Web3.js / ethers.js**: Blockchain interaction.
- **MetaMask**: Wallet connection and transaction signing.

---

## Smart Contract

The `contracts/Youtube.sol` contract allows any wallet to call `uploadVideo`.
The uploaded video is stored in contract metadata and the NFT is minted to
`msg.sender`, so non-owner creators can publish and own their uploads.

Useful commands:

```bash
npm run compile:contracts
npm run test:contracts
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

After deploying, copy the contract address into `.env` as
`REACT_APP_CONTRACT_ADDRESS`.

---

## Upload Configuration

The browser upload flow is intentionally not a demo stub. Configure one IPFS
backend before uploading:

```bash
REACT_APP_PINATA_UPLOAD_URL=/api/pinata/upload
```

or:

```bash
REACT_APP_IPFS_API_URL=http://127.0.0.1:5001
```

The Pinata upload URL should point at a server-side endpoint that stores the
Pinata JWT outside the React bundle and returns an IPFS hash as `IpfsHash`,
`Hash`, or `cid`.

If no IPFS backend or contract address is configured, the UI shows an actionable
error instead of pretending the upload succeeded.

---

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/mohitagarwal24/Decentralised-youtube.git
cd Decentralised-youtube
```

2. **Install dependencies**
```bash
npm install
```

3. **Create local environment**
```bash
cp .env.example .env
```

4. **Run the app**
```bash
npm start
```
