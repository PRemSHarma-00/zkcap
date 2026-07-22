import { spawn } from 'child_process';
import path from 'path';
import { prisma } from '../database/client';
import { settings } from '../core/config';

export class MidnightClient {
  private workerDir: string;

  constructor() {
    this.workerDir = path.resolve(__dirname, '../../../../worker/midnight');
  }

  async anchorAttestation(
    attestationId: string,
    projectId: string,
    attestationHash: string,
    securityScore: number,
    timestamp: number,
    repositoryId: string,
    commitHash: string,
    authorSignature: string
  ): Promise<{ success: boolean; midnight_tx_id?: string; contract_address?: string; error?: string }> {
    console.log(`Initiating Midnight ZK proving and anchoring for attestation: ${attestationId}`);

    const attestation = await prisma.attestation.findUnique({ where: { id: attestationId } });
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
      MIDNIGHT_CONTRACT_ADDRESS: settings.midnightContractAddress,
      MIDNIGHT_RPC_ENDPOINT: settings.midnightRpcEndpoint,
      MIDNIGHT_RPC_WEBSOCKET: settings.midnightRpcWebsocket,
      MIDNIGHT_PROOF_SERVER: settings.midnightProofServer,
    };

    return new Promise((resolve) => {
      const child = spawn('npx', args, { cwd: this.workerDir, env });
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
              await prisma.attestation.update({
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
            } else {
              await prisma.attestation.update({
                where: { id: attestationId },
                data: { status: 'failed' },
              });
              resolve({ success: false, error: output.error || 'Unknown error' });
            }
          } catch (e: any) {
            await prisma.attestation.update({
              where: { id: attestationId },
              data: { status: 'failed' },
            });
            resolve({ success: false, error: e.message });
          }
        } else {
          let errorMsg = stderr.trim();
          try {
            const errJson = JSON.parse(errorMsg);
            errorMsg = errJson.error || errorMsg;
          } catch (e) {
            // ignore
          }
          await prisma.attestation.update({
            where: { id: attestationId },
            data: { status: 'failed' },
          });
          resolve({ success: false, error: errorMsg });
        }
      });
    });
  }
}

export const midnightClient = new MidnightClient();
