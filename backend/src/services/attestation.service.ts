import { prisma } from '../database/client';

export class AttestationService {
  async getAttestations(commitId: string) {
    return prisma.attestation.findUnique({ where: { commit_id: commitId } });
  }
}
export const attestationService = new AttestationService();
