import { Router, Request, Response } from 'express';
import { requireAuth } from '../../core/auth';
import { attestationService } from '../../services/attestation.service';

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  if (!req.query.commit_id) {
    res.status(400).json({ detail: 'commit_id is required' });
    return;
  }
  try {
    const attestation = await attestationService.getAttestations(req.query.commit_id as string);
    if (!attestation) {
      res.status(404).json({ detail: 'Attestation not found' });
      return;
    }
    res.json(attestation);
  } catch (e: any) {
    res.status(500).json({ detail: e.message });
  }
});

export default router;
