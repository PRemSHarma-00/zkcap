import { Router, Request, Response } from 'express';
import { requireAuth } from '../../core/auth';
import { projectService } from '../../services/project.service';
import { ProjectCreateSchema } from '../../schemas';

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const projects = await projectService.getProjects(req.user!.id);
    res.json(projects);
  } catch (e: any) {
    res.status(500).json({ detail: e.message });
  }
});

router.post('/', requireAuth, async (req: Request, res: Response) => {
  const parsed = ProjectCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ detail: parsed.error });
    return;
  }
  try {
    const project = await projectService.createProject(req.user!.id, parsed.data);
    res.status(201).json(project);
  } catch (e: any) {
    if (e.message === 'Project already exists') {
      res.status(400).json({ detail: 'Project with this repo already exists' });
    } else {
      res.status(500).json({ detail: e.message });
    }
  }
});

export default router;
