# Robin Harvest Testnet Setup & Testing Guide

This document outlines the steps taken to set up the dummy (mock) tokens on the Robinhood Testnet and how to mint them for local UI testing.

## 1. Mock Token Deployment

During the smart contract deployment phase, we deployed mock ERC-20 tokens to simulate the assets that Robin Harvest interacts with.

The following mock tokens were deployed to the Robinhood Chain Testnet (Chain ID 46630):
- **Mock INDEX Token:** `0x082b19F2443cc903Cabd638f65256dDee3590840`
- **Mock WETH Token:** `0x16837f1777DDF8AbEf9539bC6291976c2ca4ba8c`
- **Mock INDEX/WETH LP Token:** `0x30d21De90C862d46a6C5042282350D908f790B31`

These addresses are hardcoded into the frontend configuration (`config/contracts.ts`) so the UI correctly routes approvals and deposits to the testnet mocks.

## 2. Minting Dummy Tokens

Because these are mock contracts, the contract deployer (or any address, depending on access controls) can mint arbitrary amounts of tokens to any wallet address for testing purposes.

If a new tester connects their wallet to the frontend, they will start with a 0 balance. To give them tokens, you can run the following Foundry `cast` commands from your terminal.

*(Note: Ensure you have your `DEPLOYER_PRIVATE_KEY` and `ROBINHOOD_RPC_URL` available in your `.env` file.)*

### Mint 1,000,000 Mock INDEX
```bash
cast send 0x082b19F2443cc903Cabd638f65256dDee3590840 "mint(address,uint256)" <TESTER_WALLET_ADDRESS> 1000000000000000000000000 --rpc-url https://rpc.testnet.chain.robinhood.com --private-key <DEPLOYER_PRIVATE_KEY>
```

### Mint 1,000,000 Mock LP Tokens
```bash
cast send 0x30d21De90C862d46a6C5042282350D908f790B31 "mint(address,uint256)" <TESTER_WALLET_ADDRESS> 1000000000000000000000000 --rpc-url https://rpc.testnet.chain.robinhood.com --private-key <DEPLOYER_PRIVATE_KEY>
```

*(You can also save these commands in a `mint.sh` script to quickly top up testing wallets.)*

## 3. UI Fixes Implemented
- Fixed a bug where `useReadContract` would hang on "Loading..." if the user's wallet was connected but configured to the wrong network (e.g. Ethereum Mainnet). Forced Wagmi to strictly query the testnet Chain ID (46630) for balance reads.
- Addressed an OpenZeppelin ERC-4626 standard offset issue: the smart contracts inflate the Vault share decimals to 26 (from 18) to mitigate inflation attacks. The frontend was updated to dynamically read the Vault's `decimals()` on-chain so the Portfolio accurately displays the user's share balances and estimated annual yield.
- Added automatic background data refetching inside `vault-action-panel.tsx` so the UI instantly updates your remaining allowance and balance the moment an on-chain transaction confirms.
