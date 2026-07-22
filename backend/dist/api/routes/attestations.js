"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../core/auth");
const attestation_service_1 = require("../../services/attestation.service");
const router = (0, express_1.Router)();
router.get('/', auth_1.requireAuth, async (req, res) => {
    if (!req.query.commit_id) {
        res.status(400).json({ detail: 'commit_id is required' });
        return;
    }
    try {
        const attestation = await attestation_service_1.attestationService.getAttestations(req.query.commit_id);
        if (!attestation) {
            res.status(404).json({ detail: 'Attestation not found' });
            return;
        }
        res.json(attestation);
    }
    catch (e) {
        res.status(500).json({ detail: e.message });
    }
});
exports.default = router;
