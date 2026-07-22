"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../core/auth");
const commit_service_1 = require("../../services/commit.service");
const router = (0, express_1.Router)();
router.get('/', auth_1.requireAuth, async (req, res) => {
    if (!req.query.project_id) {
        res.status(400).json({ detail: 'project_id is required' });
        return;
    }
    try {
        const commits = await commit_service_1.commitService.getCommits(req.query.project_id);
        res.json(commits);
    }
    catch (e) {
        res.status(500).json({ detail: e.message });
    }
});
exports.default = router;
