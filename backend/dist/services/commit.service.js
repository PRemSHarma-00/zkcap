"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitService = exports.CommitService = void 0;
const client_1 = require("../database/client");
class CommitService {
    async getCommits(projectId) {
        return client_1.prisma.commit.findMany({ where: { project_id: projectId } });
    }
    async createCommit(data) {
        return client_1.prisma.commit.create({ data });
    }
}
exports.CommitService = CommitService;
exports.commitService = new CommitService();
