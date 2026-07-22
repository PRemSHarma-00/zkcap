import { prisma } from '../database/client';

export class CommitService {
  async getCommits(projectId: string) {
    return prisma.commit.findMany({ where: { project_id: projectId } });
  }

  async createCommit(data: any) {
    return prisma.commit.create({ data });
  }
}
export const commitService = new CommitService();
