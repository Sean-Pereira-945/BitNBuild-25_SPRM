// Service to interact with POAP smart contract (local blockchain for now)
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Hardhat local node default
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
// Use the first account from local node for testing
const privateKey = '0x59c6995e998f97a5a0044976f7d4e20d3d5b3c7c7c7c7c7c7c7c7c7c7c7c7c7c'; // Hardhat default
const wallet = new ethers.Wallet(privateKey, provider);

const contractPath = path.join(__dirname, '../../blockchain/artifacts/contracts/POAP.sol/POAP.json');
const contractJson = JSON.parse(fs.readFileSync(contractPath));
const contractAddress = process.env.POAP_CONTRACT_ADDRESS || '0xYourDeployedContractAddress';
const poapContract = new ethers.Contract(contractAddress, contractJson.abi, wallet);

async function createEvent(name, uri) {
  const tx = await poapContract.createEvent(name, uri);
  const receipt = await tx.wait();
  const event = receipt.events.find(e => e.event === 'EventCreated');
  return event.args.eventId.toString();
}

async function mintPOAP(eventId, attendeeAddress) {
  const tx = await poapContract.mintPOAP(eventId, attendeeAddress);
  const receipt = await tx.wait();
  const event = receipt.events.find(e => e.event === 'POAPMinted');
  return event.args.tokenId.toString();
}

module.exports = { createEvent, mintPOAP };
