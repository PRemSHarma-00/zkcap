"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = exports.ProjectService = void 0;
const client_1 = require("../database/client");
class ProjectService {
    async getProjects(userId) {
        const projects = await client_1.prisma.project.findMany({
            where: { user_id: userId },
            include: { commits: true }
        });
        return projects.map(p => ({
            ...p,
            commit_count: p.commits.length,
        }));
    }
    async createProject(userId, data) {
        const existing = await client_1.prisma.project.findUnique({ where: { github_repo: data.github_repo } });
        if (existing) {
            throw new Error('Project already exists');
        }
        return client_1.prisma.project.create({
            data: {
                user_id: userId,
                name: data.github_repo.split('/').pop() || data.github_repo,
                github_repo: data.github_repo,
            },
        });
    }
}
exports.ProjectService = ProjectService;
exports.projectService = new ProjectService();
