# RobinHarvest

RobinHarvest is a modern Web3 DeFi dashboard and yield aggregator interface built with Next.js. It provides users with a seamless, intuitive experience to manage their crypto portfolio, interact with smart contract vaults (such as Yearn V3 and Beefy), and track their yield farming performance.

## 🌟 Features

- **Modern Tech Stack**: Built with Next.js 14 (App Router), React, TypeScript, and Tailwind CSS.
- **Web3 Integration**: Seamless wallet connection and blockchain interactions powered by `wagmi` and `viem`.
- **Beautiful UI**: Highly polished, responsive, and accessible components built with Radix UI and shadcn/ui.
- **Yield Vaults**: Interface to deposit, withdraw, and track performance across various DeFi vaults.
- **Portfolio Tracking**: Real-time insights into user balances, transactions, and historical performance.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ysh204/RobinHarvest.git
   cd RobinHarvest
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Copy the example environment file and configure it with your own API keys (e.g., WalletConnect Project ID, RPC endpoints).
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🏗️ Project Structure

- `/app`: Next.js App Router pages and layouts.
- `/components`: Reusable UI components (including `shadcn/ui` components in `/components/ui`).
- `/config`: Configuration files for Web3 (Wagmi, Chains) and site metadata.
- `/hooks`: Custom React hooks for data fetching and state management.
- `/lib`: Utility functions, constants, ABIs, and mock data.
- `/public`: Static assets like images and fonts.
- `/types`: TypeScript interfaces and type definitions.

## 🛠️ Built With

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Wagmi](https://wagmi.sh/) & [Viem](https://viem.sh/)

## 📄 License

This project is licensed under the MIT License.
