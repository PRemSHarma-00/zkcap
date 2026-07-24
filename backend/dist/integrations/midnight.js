"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.midnightClient = exports.MidnightClient = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const client_1 = require("../database/client");
const config_1 = require("../core/config");
class MidnightClient {
    workerDir;
    constructor() {
        this.workerDir = path_1.default.resolve(__dirname, '../../../../worker/midnight');
    }
    async anchorAttestation(attestationId, projectId, attestationHash, securityScore, timestamp, repositoryId, commitHash, authorSignature) {
        console.log(`Initiating Midnight ZK proving and anchoring for attestation: ${attestationId}`);
        const attestation = await client_1.prisma.attestation.findUnique({ where: { id: attestationId } });
        if (!attestation) {
            console.error(`Attestation ${attestationId} not found in database`);
            return { success: false, error: 'Attestation not found' };
        }
        const args = [
            'ts-node',
            'src/prover.ts',
            projectId,
            attestationHash,
            securityScore.toString(),
            timestamp.toString(),
            repositoryId,
            commitHash,
            authorSignature,
        ];
        const env = {
            ...process.env,
            MIDNIGHT_CONTRACT_ADDRESS: config_1.settings.midnightContractAddress,
            MIDNIGHT_RPC_ENDPOINT: config_1.settings.midnightRpcEndpoint,
            MIDNIGHT_RPC_WEBSOCKET: config_1.settings.midnightRpcWebsocket,
            MIDNIGHT_PROOF_SERVER: config_1.settings.midnightProofServer,
        };
        return new Promise((resolve) => {
            const child = (0, child_process_1.spawn)('npx', args, { cwd: this.workerDir, env });
            let stdout = '';
            let stderr = '';
            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            child.on('close', async (code) => {
                if (code === 0) {
                    try {
                        const output = JSON.parse(stdout.trim());
                        if (output.success) {
                            await client_1.prisma.attestation.update({
                                where: { id: attestationId },
                                data: {
                                    status: 'onchain',
                                    onchain_tx: output.midnight_tx_id,
                                },
                            });
                            resolve({
                                success: true,
                                midnight_tx_id: output.midnight_tx_id,
                                contract_address: output.contract_address,
                            });
                        }
                        else {
                            await client_1.prisma.attestation.update({
                                where: { id: attestationId },
                                data: { status: 'failed' },
                            });
                            resolve({ success: false, error: output.error || 'Unknown error' });
                        }
                    }
                    catch (e) {
                        await client_1.prisma.attestation.update({
                            where: { id: attestationId },
                            data: { status: 'failed' },
                        });
                        resolve({ success: false, error: e.message });
                    }
                }
                else {
                    let errorMsg = stderr.trim();
                    try {
                        const errJson = JSON.parse(errorMsg);
                        errorMsg = errJson.error || errorMsg;
                    }
                    catch (e) {
                        // ignore
                    }
                    await client_1.prisma.attestation.update({
                        where: { id: attestationId },
                        data: { status: 'failed' },
                    });
                    resolve({ success: false, error: errorMsg });
                }
            });
        });
    }
}
exports.MidnightClient = MidnightClient;
exports.midnightClient = new MidnightClient();
