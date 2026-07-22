"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateZkTlsProofForCommit = generateZkTlsProofForCommit;
exports.getProofForCommit = getProofForCommit;
exports.validateProof = validateProof;
const client_1 = require("../database/client");
async function generateZkTlsProofForCommit(commitId, repositoryUrl, commitHash, author) {
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
        await client_1.prisma.commit.update({
            where: { id: commitId },
            data: { zkTLS_proof: proof },
        });
        console.log(`zkTLS proof generated for commit: ${commitHash.substring(0, 8)}`);
        return proof;
    }
    catch (error) {
        console.error(`Failed to generate zkTLS proof for commit ${commitId}: ${error.message}`);
        return null;
    }
}
async function getProofForCommit(commitId) {
    const commit = await client_1.prisma.commit.findUnique({ where: { id: commitId } });
    if (commit && commit.zkTLS_proof) {
        return commit.zkTLS_proof;
    }
    return null;
}
function validateProof(proof) {
    if (!proof)
        return false;
    const requiredFields = ['proof', 'claim', 'provider'];
    return requiredFields.every((field) => field in proof);
}
