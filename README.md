# Ethereum Counter dApp

A simple decentralized application (dApp) built with Next.js that interacts with a counter smart contract on the Nexus testnet.

## Overview

This project demonstrates a basic integration between a web application and the Nexus blockchain. It features a smart contract that maintains a counter which can only be incremented, showcasing fundamental blockchain interactions like:
- Smart contract deployment and interaction
- Wallet connection
- Transaction signing
- Event listening
- State updates

## Prerequisites

- Node.js (v18 or higher)
- MetaMask browser extension
- NEX for gas fees (get from the Nexus faucet)
- A code editor (VS Code or Cursor recommended)

## Smart Contract Details

The Counter smart contract (`contracts/src/Counter.sol`) implements:
- A private counter variable
- An increment function that adds 1 to the counter
- A getter function to read the current count
- An event emission after each increment

Key contract functions:
```solidity
function increment() public
function getCount() public view returns (uint256)
```

## Installation & Setup

1. Clone and install dependencies:
```bash
git clone <this-repo-url>
cd your-repo
npm install
```

2. Deploy the smart contract:
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network nexus
```

3. Configure the frontend:
Configure the frontend to use the deployed contract address on Nexus.

Modify the `frontend/src/app/page.tsx` file to use the deployed contract address:

```typescript
const CONTRACT_ADDRESS = 'your_deployed_contract_address' // You'll need to update this after deploying to Nexus
```

1. Start the NextJS development server:

```bash
cd frontend
npm run dev
```

## Using the dApp

1. Connect Your Wallet:
   - Ensure MetaMask is installed
   - Switch to the Nexus testnet network
   - Click "Connect Wallet" in the dApp
   - Approve the connection in MetaMask

2. Interact with the Counter:
   - View the current count
   - Click "Increment Counter" to increase the value
   - Confirm the transaction in MetaMask
   - Wait for transaction confirmation
   - See the updated count

## Technology Stack

### Frontend
- Next.js 13+ (React framework)
- TypeScript for type safety
- Tailwind CSS for styling
- ethers.js for blockchain interaction
- web3modal for wallet connection

### Blockchain
- Network: Nexus Testnet
- Smart Contract Language: Solidity ^0.8.0
- Contract Framework: Hardhat
- Contract Interaction: ethers.js

## Common Issues & Solutions

1. Transaction Failures:
   - Ensure you have enough Nexus ETH for gas
   - Check if MetaMask is connected to Nexus testnet

2. Wallet Connection Issues:
   - Try refreshing the page
   - Ensure MetaMask is unlocked
   - Clear browser cache if persistent

## Development

### Project Structure
```
your-repo/
├── contracts/
│   └── contracts/
│       └── Counter.sol
├── frontend/
│   ├── pages/
│   │   └── index.tsx
│   └── package.json
└── package.json
```

### Local Development
1. Make code changes
2. Test contracts with `npx hardhat test`
3. Deploy to Nexus testnet
4. Test frontend with `npm run dev`
5. Ensure MetaMask is connected to Nexus testnet

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
