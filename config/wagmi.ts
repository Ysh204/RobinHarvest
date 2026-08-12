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
import { getWalletConnectProjectId, IS_PRODUCTION } from './env'

const walletConnectProjectId = getWalletConnectProjectId()

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

const appChains = IS_PRODUCTION ? ([robinhoodChain] as const) : ([sepolia, mainnet, robinhoodChain] as const)

export const config = createConfig({
  chains: appChains,
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
