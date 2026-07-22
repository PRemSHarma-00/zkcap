import { prisma } from '../database/client';

export class ProjectService {
  async getProjects(userId: string) {
    const projects = await prisma.project.findMany({ 
      where: { user_id: userId },
      include: { commits: true } 
    });
    return projects.map(p => ({
      ...p,
      commit_count: p.commits.length,
    }));
  }

  async createProject(userId: string, data: { github_repo: string }) {
    const existing = await prisma.project.findUnique({ where: { github_repo: data.github_repo } });
    if (existing) {
      throw new Error('Project already exists');
    }
    return prisma.project.create({
      data: {
        user_id: userId,
        name: data.github_repo.split('/').pop() || data.github_repo,
        github_repo: data.github_repo,
      },
    });
  }
}
export const projectService = new ProjectService();
