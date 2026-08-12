import testnetManifest from './manifest.testnet.json'
import { getManifestPath, IS_PRODUCTION, IS_STAGING, type DeploymentManifest } from '../env'

const MANIFEST_REGISTRY: Record<string, DeploymentManifest> = {
  'deployments/manifest.testnet.json': testnetManifest as DeploymentManifest,
}

/** Load the canonical deployment manifest for the active environment. */
export function loadDeploymentManifest(): DeploymentManifest {
  const path = getManifestPath()
  const manifest = MANIFEST_REGISTRY[path]

  if (!manifest) {
    throw new Error(
      `Unknown deployment manifest "${path}". Register it in config/deployments/index.ts and config/deployments/.`,
    )
  }

  if ((IS_PRODUCTION || IS_STAGING) && path.includes('testnet')) {
    throw new Error(
      'Production and staging must not use a testnet deployment manifest. Set NEXT_PUBLIC_DEPLOYMENT_MANIFEST to a production manifest path.',
    )
  }

  return manifest
}
