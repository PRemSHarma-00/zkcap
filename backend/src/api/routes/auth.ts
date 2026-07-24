import { Router, Request, Response } from 'express';
import { prisma } from '../../database/client';
import { createToken, requireAuth } from '../../core/auth';

const router = Router();

router.post('/github', async (req: Request, res: Response) => {
  const { access_token } = req.body;
  if (!access_token) {
    res.status(400).json({ detail: 'access_token required' });
    return;
  }

  try {
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          github_id: 12345,
          github_username: 'mockuser',
          access_token_hash: 'mockhash',
        }
      });
    }

    const token = createToken({ id: user.id, github_username: user.github_username });
    res.json({ token, token_type: 'bearer' });
  } catch (e: any) {
    res.status(500).json({ detail: e.message });
  }
});

router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      res.status(404).json({ detail: 'User not found' });
      return;
    }
    res.json({
      id: user.id,
      github_id: Number(user.github_id),
      github_username: user.github_username,
      github_avatar_url: user.github_avatar_url,
    });
  } catch (e: any) {
    res.status(500).json({ detail: e.message });
  }
});

export default router;
