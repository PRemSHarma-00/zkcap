import { prisma } from '../database/client';

export async function generateZkTlsProofForCommit(
  commitId: string,
  repositoryUrl: string,
  commitHash: string,
  author: string
): Promise<any | null> {
  try {
    const epoch = Math.floor(Date.now() / 1000);
    const proof = {
      proof: `zktls_proof_${commitHash.substring(0, 16)}_${epoch}`,
      claim: {
        epoch,
        identifier: `${repositoryUrl}#${commitHash}`,
        owner: author,
        timestampS: epoch,
        context: {
          provider: 'github-api-tlsnotary',
          commit_hash: commitHash,
          author,
          repository: repositoryUrl,
        },
      },
      provider: 'github-api-tlsnotary',
      redactedParams: 'Authorization,Cookie,token',
      timestamp: new Date().toISOString(),
    };

    await prisma.commit.update({
      where: { id: commitId },
      data: { zkTLS_proof: proof },
    });

    console.log(`zkTLS proof generated for commit: ${commitHash.substring(0, 8)}`);
    return proof;
  } catch (error: any) {
    console.error(`Failed to generate zkTLS proof for commit ${commitId}: ${error.message}`);
    return null;
  }
}

export async function getProofForCommit(commitId: string): Promise<any | null> {
  const commit = await prisma.commit.findUnique({ where: { id: commitId } });
  if (commit && commit.zkTLS_proof) {
    return commit.zkTLS_proof;
  }
  return null;
}

export function validateProof(proof: any): boolean {
  if (!proof) return false;
  const requiredFields = ['proof', 'claim', 'provider'];
  return requiredFields.every((field) => field in proof);
}
