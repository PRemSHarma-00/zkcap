"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("../../database/client");
const auth_1 = require("../../core/auth");
const router = (0, express_1.Router)();
router.post('/github', async (req, res) => {
    const { access_token } = req.body;
    if (!access_token) {
        res.status(400).json({ detail: 'access_token required' });
        return;
    }
    try {
        let user = await client_1.prisma.user.findFirst();
        if (!user) {
            user = await client_1.prisma.user.create({
                data: {
                    github_id: 12345,
                    github_username: 'mockuser',
                    access_token_hash: 'mockhash',
                }
            });
        }
        const token = (0, auth_1.createToken)({ id: user.id, github_username: user.github_username });
        res.json({ token, token_type: 'bearer' });
    }
    catch (e) {
        res.status(500).json({ detail: e.message });
    }
});
router.get('/me', auth_1.requireAuth, async (req, res) => {
    try {
        const user = await client_1.prisma.user.findUnique({ where: { id: req.user.id } });
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
    }
    catch (e) {
        res.status(500).json({ detail: e.message });
    }
});
exports.default = router;
