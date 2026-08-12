// AUTO-GENERATED from robin-harvest-contracts/out/GrowthStrategy.sol/GrowthStrategy.json
// Run: cd robin-harvest-contracts && node scripts/export-abis.mjs
export const growthStrategyAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "vault_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "asset_",
        "type": "address",
        "internalType": "contract IERC20"
      },
      {
        "name": "authority_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "indexFinance_",
        "type": "address",
        "internalType": "contract IIndexFinanceCore"
      },
      {
        "name": "rewardRegistry_",
        "type": "address",
        "internalType": "contract IRewardRegistry"
      },
      {
        "name": "oracleRegistry_",
        "type": "address",
        "internalType": "contract IOracleRegistry"
      },
      {
        "name": "executionRouter_",
        "type": "address",
        "internalType": "contract IExecutionRouter"
      },
      {
        "name": "maxSlippageBps_",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "swapDeadlineDelay_",
        "type": "uint48",
        "internalType": "uint48"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "addRewardToken",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "asset",
    "inputs": [],
    "outputs": [
      {
        "name": "assetAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "authority",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "categoryExposure",
    "inputs": [
      {
        "name": "category",
        "type": "uint8",
        "internalType": "enum RewardCategory"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "exposureBps",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "categoryPolicies",
    "inputs": [
      {
        "name": "category",
        "type": "uint8",
        "internalType": "enum RewardCategory"
      }
    ],
    "outputs": [
      {
        "name": "targetRetainBps",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "minRetainBps",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "maxRetainBps",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "maxPortfolioBps",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "rebalanceCooldown",
        "type": "uint48",
        "internalType": "uint48"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "deployFunds",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deployedAssets",
    "inputs": [],
    "outputs": [
      {
        "name": "assets_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "emergencyWithdraw",
    "inputs": [],
    "outputs": [
      {
        "name": "amountFreed",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "loss",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "executionRouter",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IExecutionRouter"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "freeFunds",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "amountFreed",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "loss",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "harvest",
    "inputs": [],
    "outputs": [
      {
        "name": "report_",
        "type": "tuple",
        "internalType": "struct HarvestReport",
        "components": [
          {
            "name": "gain",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "loss",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "debtPayment",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "indexFinance",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IIndexFinanceCore"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isConsumingScheduledOp",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isRetainedToken",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "tracked",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isRewardTokenIsolated",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "isolated",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isRewardTokenTracked",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "tracked",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lastRebalanceAt",
    "inputs": [
      {
        "name": "category",
        "type": "uint8",
        "internalType": "enum RewardCategory"
      }
    ],
    "outputs": [
      {
        "name": "timestamp",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lastReportedAssets",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lifecycleState",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "enum LifecycleState"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "liquidationOrder",
    "inputs": [],
    "outputs": [
      {
        "name": "tokens",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "markRebalance",
    "inputs": [
      {
        "name": "category",
        "type": "uint8",
        "internalType": "enum RewardCategory"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "maxSlippageBps",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "navHaircutBps",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "oracleRegistry",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IOracleRegistry"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pause",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "previewInKindRedemption",
    "inputs": [
      {
        "name": "shares",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "result",
        "type": "tuple",
        "internalType": "struct InKindRedemptionResult",
        "components": [
          {
            "name": "debtReduction",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "indexPaid",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "retainedTokens",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "retainedAmounts",
            "type": "uint256[]",
            "internalType": "uint256[]"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "processRewardToken",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "assetGain",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "pruneRetainedToken",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "redeemInKind",
    "inputs": [
      {
        "name": "shares",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "debtReduction",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "maxLossBps",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "outputs": [
      {
        "name": "result",
        "type": "tuple",
        "internalType": "struct InKindRedemptionResult",
        "components": [
          {
            "name": "debtReduction",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "indexPaid",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "retainedTokens",
            "type": "address[]",
            "internalType": "address[]"
          },
          {
            "name": "retainedAmounts",
            "type": "uint256[]",
            "internalType": "uint256[]"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeRewardToken",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "retainedBalance",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "retainedExposureBps",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "exposureBps",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "retainedTokenCount",
    "inputs": [],
    "outputs": [
      {
        "name": "count",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "retainedTokens",
    "inputs": [],
    "outputs": [
      {
        "name": "tokens",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "retainedValue",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "rewardRegistry",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IRewardRegistry"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "rewardTokens",
    "inputs": [],
    "outputs": [
      {
        "name": "tokens",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "setAuthority",
    "inputs": [
      {
        "name": "newAuthority",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setCategoryPolicy",
    "inputs": [
      {
        "name": "category",
        "type": "uint8",
        "internalType": "enum RewardCategory"
      },
      {
        "name": "policy",
        "type": "tuple",
        "internalType": "struct CategoryPolicy",
        "components": [
          {
            "name": "targetRetainBps",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "minRetainBps",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "maxRetainBps",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "maxPortfolioBps",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "rebalanceCooldown",
            "type": "uint48",
            "internalType": "uint48"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setCoreParameters",
    "inputs": [
      {
        "name": "newMaxSlippageBps",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "newSwapDeadlineDelay",
        "type": "uint48",
        "internalType": "uint48"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setLiquidationOrder",
    "inputs": [
      {
        "name": "tokens",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setNavHaircutBps",
    "inputs": [
      {
        "name": "newHaircutBps",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setRewardTokenIsolated",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "isolated",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "shutdown",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "swapDeadlineDelay",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint48",
        "internalType": "uint48"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tend",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "tokenExposureBps",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "exposureBps",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalAssets",
    "inputs": [],
    "outputs": [
      {
        "name": "totalManagedAssets",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "unpause",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "vault",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "AdapterApprovalUpdated",
    "inputs": [
      {
        "name": "adapter",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "AuthorityUpdated",
    "inputs": [
      {
        "name": "authority",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CoreCapitalDeployed",
    "inputs": [
      {
        "name": "assets",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CoreCapitalFreed",
    "inputs": [
      {
        "name": "requestedAssets",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "withdrawnAssets",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "loss",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CoreParametersUpdated",
    "inputs": [
      {
        "name": "maxSlippageBps",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      },
      {
        "name": "swapDeadlineDelay",
        "type": "uint48",
        "indexed": false,
        "internalType": "uint48"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CoreRewardDeferred",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "minHarvestAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CoreRewardSkipped",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "disposition",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum RewardDisposition"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CoreRewardSold",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amountIn",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "amountOut",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CoreRewardsClaimed",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EligibilityStatusChanged",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "eligible",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "indexBalance",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "threshold",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EligibilityThresholdUpdated",
    "inputs": [
      {
        "name": "previousThreshold",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "newThreshold",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EmergencyWithdrawal",
    "inputs": [
      {
        "name": "amountFreed",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "loss",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FundsDeployed",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FundsFreed",
    "inputs": [
      {
        "name": "requested",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "amountFreed",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "loss",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "GrowthCategoryPolicyUpdated",
    "inputs": [
      {
        "name": "category",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum RewardCategory"
      },
      {
        "name": "policy",
        "type": "tuple",
        "indexed": false,
        "internalType": "struct CategoryPolicy",
        "components": [
          {
            "name": "targetRetainBps",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "minRetainBps",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "maxRetainBps",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "maxPortfolioBps",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "rebalanceCooldown",
            "type": "uint48",
            "internalType": "uint48"
          }
        ]
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "GrowthInKindRedeemed",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "shares",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "indexPaid",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "tokens",
        "type": "address[]",
        "indexed": false,
        "internalType": "address[]"
      },
      {
        "name": "amounts",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "GrowthRebalanceMarked",
    "inputs": [
      {
        "name": "category",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum RewardCategory"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "GrowthRetentionSkipped",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "reason",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "GrowthRetentionSplit",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "retainedAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "soldAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "retainBps",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "GrowthRewardRetained",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "category",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum RewardCategory"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LifecycleStateChanged",
    "inputs": [
      {
        "name": "previousState",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum LifecycleState"
      },
      {
        "name": "newState",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum LifecycleState"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LiquidationOrderUpdated",
    "inputs": [
      {
        "name": "tokens",
        "type": "address[]",
        "indexed": false,
        "internalType": "address[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "NavHaircutUpdated",
    "inputs": [
      {
        "name": "previousHaircutBps",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      },
      {
        "name": "newHaircutBps",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OracleConfigured",
    "inputs": [
      {
        "name": "asset",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "feed",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "heartbeat",
        "type": "uint48",
        "indexed": false,
        "internalType": "uint48"
      },
      {
        "name": "paused",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RetainedTokenPruned",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RetainedTokenSkipped",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "reason",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RewardProcessingFailed",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "reasonData",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RewardTokenConfigured",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "enabled",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "category",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum RewardCategory"
      },
      {
        "name": "retainable",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "maxExposureBps",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RewardTokenIsolationUpdated",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "isolated",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RewardTokenTracked",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tracked",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StrategyReported",
    "inputs": [
      {
        "name": "strategy",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "gain",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "loss",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "debtPayment",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "StrategyTended",
    "inputs": [
      {
        "name": "keeper",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SwapExecuted",
    "inputs": [
      {
        "name": "adapter",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tokenIn",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tokenOut",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amountIn",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "amountOut",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UnpriceableAssetSkipped",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "oracle",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AccessManagedInvalidAuthority",
    "inputs": [
      {
        "name": "authority",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "AccessManagedRequiredDelay",
    "inputs": [
      {
        "name": "caller",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "delay",
        "type": "uint32",
        "internalType": "uint32"
      }
    ]
  },
  {
    "type": "error",
    "name": "AccessManagedUnauthorized",
    "inputs": [
      {
        "name": "caller",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "CooldownActive",
    "inputs": [
      {
        "name": "availableAt",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "DeadlineOverflow",
    "inputs": [
      {
        "name": "deadline",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ExposureLimitExceeded",
    "inputs": [
      {
        "name": "subject",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "exposureBps",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxExposureBps",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "FeeOnTransferDetected",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "expectedAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "receivedAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "InKindSupplyInvalid",
    "inputs": []
  },
  {
    "type": "error",
    "name": "IndexFinanceIneligible",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidAccounting",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidBasisPoints",
    "inputs": [
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidLifecycleState",
    "inputs": [
      {
        "name": "currentState",
        "type": "uint8",
        "internalType": "uint8"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidRange",
    "inputs": [
      {
        "name": "minimum",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "target",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maximum",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidRewardClaim",
    "inputs": []
  },
  {
    "type": "error",
    "name": "LossExceedsMaximum",
    "inputs": [
      {
        "name": "lossBps",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxLossBps",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "OnlySelf",
    "inputs": [
      {
        "name": "caller",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OnlyVault",
    "inputs": [
      {
        "name": "caller",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ReentrancyGuardReentrantCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "RetainedAssetInvalid",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "RetainedAssetRouteUnavailable",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "adapter",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "RetainedAssetTransfersPaused",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "RetainedRewardsUnsupported",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "SafeERC20FailedOperation",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ZeroAddress",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ZeroAmount",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ZeroMinimumOutput",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amountIn",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ZeroReceiver",
    "inputs": []
  }
] as const
