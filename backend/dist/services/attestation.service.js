"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attestationService = exports.AttestationService = void 0;
const client_1 = require("../database/client");
class AttestationService {
    async getAttestations(commitId) {
        return client_1.prisma.attestation.findUnique({ where: { commit_id: commitId } });
    }
}
exports.AttestationService = AttestationService;
exports.attestationService = new AttestationService();
