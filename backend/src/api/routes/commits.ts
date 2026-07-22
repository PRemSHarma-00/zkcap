import { Router, Request, Response } from 'express';
import { requireAuth } from '../../core/auth';
import { commitService } from '../../services/commit.service';

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  if (!req.query.project_id) {
    res.status(400).json({ detail: 'project_id is required' });
    return;
  }
  try {
    const commits = await commitService.getCommits(req.query.project_id as string);
    res.json(commits);
  } catch (e: any) {
    res.status(500).json({ detail: e.message });
  }
});

export default router;
