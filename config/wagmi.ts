import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  injectedWallet,
  metaMaskWallet,
  phantomWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { robinhoodChain } from './chain'

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '42e1d8b7ccab1bb7bb19c58b59b15e3b'

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Installed Wallets',
      wallets: [metaMaskWallet, phantomWallet, injectedWallet, rainbowWallet],
    },
  ],
  {
    appName: 'Robin Harvest',
    projectId: walletConnectProjectId,
  }
)

export const config = createConfig({
  chains: [sepolia, mainnet, robinhoodChain],
  connectors,
  transports: {
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
    [mainnet.id]: http('https://cloudflare-eth.com'),
    [robinhoodChain.id]: http(robinhoodChain.rpcUrls.default.http[0], {
      retryCount: 1,
      timeout: 3000,
    }),
  },
  ssr: true,
})
