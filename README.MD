# Solana Trading Demo

## Project Structure

solana-trading-demo/
├── src/
│ ├── solana/
│ │ ├── config.js # Solana Configuration (Network, Connection, Wallet)
│ │ ├── WalletContext.jsx # Wallet State Management
│ │ └── transactions.js # Transaction-related Functions
│ ├── components/
│ │ ├── WalletButton.jsx # Wallet Connection Button
│ │ ├── TransferForm.jsx # SOL Transfer Form
│ │ └── TransactionHistory.jsx # Transaction History
│ ├── App.jsx # Main Application
│ └── App.css / index.css # Styles
└── package.json



## Features
- Wallet Connection: Supports Phantom and Solflare wallets
- Balance Check: Displays SOL balance in real time
- SOL Transfer: Send SOL to a specified wallet address
- Devnet Airdrop: One-click to obtain test SOL tokens
- Transaction History: View recent transaction records

## Getting Started
1. Install the Phantom wallet browser extension (https://phantom.app/)
2. Switch to the Devnet network to get test SOL
3. Visit http://localhost:5173/ to connect your wallet and start using