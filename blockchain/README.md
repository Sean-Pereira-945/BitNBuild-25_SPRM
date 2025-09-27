# Blockchain Migration (POAP Edition)

This directory contains smart contracts and deployment scripts for moving event management to the Polygon blockchain.

## Smart Contracts
- `EventManager.sol`: Basic event creation on-chain.
- `POAP.sol`: ERC-721 NFT contract for event attendance badges (POAPs).

## Setup
1. Add your Polygon wallet private key to `.env`.
2. Install dependencies:
   ```
   npm install --save-dev hardhat @nomiclabs/hardhat-waffle @openzeppelin/contracts ethers dotenv
   ```
3. Compile contracts:
   ```
   npx hardhat compile
   ```
4. Deploy locally:
   ```
   npx hardhat run scripts/deploy-poap.js
   ```

## Next Steps
- Integrate backend to create events and mint POAPs.
- Integrate frontend for event creation and POAP claiming.
- For mainnet/testnet, create a wallet and add your private key to `.env`.
