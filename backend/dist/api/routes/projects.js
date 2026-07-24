"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../core/auth");
const project_service_1 = require("../../services/project.service");
const schemas_1 = require("../../schemas");
const router = (0, express_1.Router)();
router.get('/', auth_1.requireAuth, async (req, res) => {
    try {
        const projects = await project_service_1.projectService.getProjects(req.user.id);
        res.json(projects);
    }
    catch (e) {
        res.status(500).json({ detail: e.message });
    }
});
router.post('/', auth_1.requireAuth, async (req, res) => {
    const parsed = schemas_1.ProjectCreateSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(422).json({ detail: parsed.error });
        return;
    }
    try {
        const project = await project_service_1.projectService.createProject(req.user.id, parsed.data);
        res.status(201).json(project);
    }
    catch (e) {
        if (e.message === 'Project already exists') {
            res.status(400).json({ detail: 'Project with this repo already exists' });
        }
        else {
            res.status(500).json({ detail: e.message });
        }
    }
});
exports.default = router;
