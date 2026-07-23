import { notFound } from 'next/navigation'
import { getVaultByAddress } from '@/config/contracts'
import { VaultDetail } from '@/components/vault/vault-detail'

export default async function VaultPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params
  const vault = getVaultByAddress(address)
  if (!vault) notFound()
  return <VaultDetail vault={vault} />
}
