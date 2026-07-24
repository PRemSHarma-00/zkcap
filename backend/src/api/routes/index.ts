import { Router } from 'express';
import projectsRouter from './projects';
import commitsRouter from './commits';
import attestationsRouter from './attestations';
import authRouter from './auth';

const router = Router();

router.use('/projects', projectsRouter);
router.use('/commits', commitsRouter);
router.use('/attestations', attestationsRouter);
router.use('/auth', authRouter);

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
