export const strategyAbi = [
  {
    inputs: [],
    name: 'harvest',
    outputs: [
      {
        components: [
          { name: 'profit', type: 'uint256' },
          { name: 'loss', type: 'uint256' },
          { name: 'protocolFees', type: 'uint256' },
          { name: 'performanceFees', type: 'uint256' },
        ],
        name: 'report',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rebalance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tend',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalAssets',
    outputs: [{ name: 'totalManagedAssets', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mode',
    outputs: [{ name: 'currentMode', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
