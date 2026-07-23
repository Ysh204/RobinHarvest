import { BaseError, ContractFunctionRevertedError, UserRejectedRequestError } from 'viem'

export interface DecodedTxError {
  /** True when the user declined in their wallet — show a quiet notice, not an error. */
  userRejected: boolean
  message: string
}

/**
 * Converts any thrown value from a simulate/write/wait call into a
 * human-readable message. Custom error selectors are not in the supplied ABI,
 * so reverts fall back to Viem's shortMessage.
 */
export function decodeTxError(error: unknown): DecodedTxError {
  if (error instanceof BaseError) {
    const rejected = error.walk((e) => e instanceof UserRejectedRequestError)
    if (rejected) {
      return { userRejected: true, message: 'Transaction rejected in wallet.' }
    }
    const revert = error.walk((e) => e instanceof ContractFunctionRevertedError)
    if (revert instanceof ContractFunctionRevertedError) {
      const reason = revert.reason ?? revert.data?.errorName
      return {
        userRejected: false,
        message: reason ? `Transaction reverted: ${reason}` : 'Transaction reverted on-chain.',
      }
    }
    return { userRejected: false, message: error.shortMessage }
  }
  if (error instanceof Error) {
    return { userRejected: false, message: error.message }
  }
  return { userRejected: false, message: 'Unknown transaction error.' }
}
